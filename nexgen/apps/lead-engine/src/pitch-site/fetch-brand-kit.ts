import {
  fetchWebsite,
  normalizeWebsiteUrl,
  USER_AGENT,
} from 'src/logic-functions/utils/fetch-website';
import { mapWithConcurrency } from 'src/logic-functions/utils/map-with-concurrency';
import {
  extractBrandAssets,
  extractBrandColors,
  extractVisibleText,
  mergePhotoCandidates,
  type WebsiteImage,
} from 'src/pitch-site/extract-brand-assets';

const MAX_PHOTOS = 12;
const MAX_PHOTO_DOWNLOADS = 24;
const MIN_PHOTO_BYTES = 15_000;
// Claude rejects images over 5 MB once base64-encoded.
const MAX_IMAGE_BYTES = 3_500_000;
const IMAGE_TIMEOUT_MS = 10_000;
const HOMEPAGE_TEXT_LENGTH = 6000;
const SUBPAGE_TEXT_LENGTH = 2500;
const NOT_A_BUSINESS_SITE_PATTERN =
  /(^|\.)(facebook|instagram|linkedin|linktr|youtube|tiktok|google)\.|\.business\.site$/i;

export type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp';

export type BrandImage = WebsiteImage & {
  // Null for SVG logos, which the page can show but Claude cannot look at.
  data: { mediaType: ImageMediaType; base64: string } | null;
};

export type BrandKit = {
  websiteUrl: string;
  logo: BrandImage | null;
  photos: BrandImage[];
  colors: string[];
  text: string;
};

const sniffImageType = (bytes: Buffer): ImageMediaType | 'image/svg+xml' | null => {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  if (bytes.subarray(0, 4).toString('hex') === '89504e47') {
    return 'image/png';
  }

  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') {
    return 'image/webp';
  }

  return /^\s*(?:<\?xml[\s\S]{0,200})?<svg\b/i.test(bytes.subarray(0, 512).toString())
    ? 'image/svg+xml'
    : null;
};

// The pitch site is served over HTTPS, where browsers upgrade or block plain-http images.
const downloadImage = async (
  image: WebsiteImage,
  referer: string,
): Promise<{ image: BrandImage; bytes: number } | null> => {
  const httpsUrl = image.url.replace(/^http:\/\//i, 'https://');

  try {
    const response = await fetch(httpsUrl, {
      headers: {
        'user-agent': USER_AGENT,
        accept: 'image/webp,image/png,image/jpeg,image/svg+xml;q=0.8',
        referer,
      },
      signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS),
    });

    if (!response.ok || Number(response.headers.get('content-length')) > MAX_IMAGE_BYTES) {
      return null;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const mediaType = sniffImageType(bytes);

    if (mediaType === null || bytes.byteLength > MAX_IMAGE_BYTES) {
      return null;
    }

    return {
      image: {
        url: response.url || httpsUrl,
        alt: image.alt,
        data:
          mediaType === 'image/svg+xml' ? null : { mediaType, base64: bytes.toString('base64') },
      },
      bytes: bytes.byteLength,
    };
  } catch {
    return null;
  }
};

// Their own logo, photos and wording are what make the concept feel like their business
// rather than a template. Any failure just means building without them.
export const fetchBrandKit = async ({
  websiteUrl,
  businessName,
}: {
  websiteUrl: string | null | undefined;
  businessName: string | null;
}): Promise<BrandKit | null> => {
  const normalizedUrl = normalizeWebsiteUrl(websiteUrl);

  try {
    if (
      normalizedUrl === null ||
      NOT_A_BUSINESS_SITE_PATTERN.test(new URL(normalizedUrl).hostname)
    ) {
      return null;
    }

    const homepage = await fetchWebsite(normalizedUrl);

    if (!homepage.ok) {
      return null;
    }

    const assets = extractBrandAssets({
      html: homepage.html,
      pageUrl: homepage.finalUrl,
      businessName,
    });
    const [stylesheets, subpages, logo] = await Promise.all([
      mapWithConcurrency(assets.stylesheetUrls, 3, fetchWebsite),
      mapWithConcurrency(assets.subpageUrls, 3, fetchWebsite),
      assets.logoUrl === null
        ? null
        : downloadImage({ url: assets.logoUrl, alt: businessName }, homepage.finalUrl),
    ]);
    const readableSubpages = subpages.filter((page) => page.ok);
    // Gallery and about pages hold most of a trade's job photos; the homepage is often badges.
    const photoCandidates = mergePhotoCandidates(
      [
        assets.photos,
        ...readableSubpages.map(
          (page) =>
            extractBrandAssets({ html: page.html, pageUrl: page.finalUrl, businessName }).photos,
        ),
      ],
      assets.logoUrl,
    ).slice(0, MAX_PHOTO_DOWNLOADS);
    const photos = await mapWithConcurrency(photoCandidates, 6, (photo) =>
      downloadImage(photo, homepage.finalUrl),
    );
    const colors = extractBrandColors([
      ...(assets.themeColor === null ? [] : [`color:${assets.themeColor}`]),
      assets.inlineCss,
      ...stylesheets.filter((stylesheet) => stylesheet.ok).map((stylesheet) => stylesheet.html),
    ]);
    const homepageText = extractVisibleText(homepage.html, Infinity);
    // Subpages repeat the homepage's menu and footer, so keep only what is new.
    const homepageLines = new Set(homepageText.split('\n'));
    const text = [
      `Home page:\n${homepageText.slice(0, HOMEPAGE_TEXT_LENGTH)}`,
      ...readableSubpages.flatMap((page) => {
        const newText = extractVisibleText(page.html, Infinity)
          .split('\n')
          .filter((line) => !homepageLines.has(line))
          .join('\n')
          .slice(0, SUBPAGE_TEXT_LENGTH);

        return newText ? [`${new URL(page.finalUrl).pathname}:\n${newText}`] : [];
      }),
    ].join('\n\n');

    return {
      websiteUrl: homepage.finalUrl,
      logo: logo?.image ?? null,
      photos: photos
        .flatMap((photo) =>
          photo !== null && photo.image.data !== null && photo.bytes >= MIN_PHOTO_BYTES
            ? [photo.image]
            : [],
        )
        .slice(0, MAX_PHOTOS),
      colors,
      text,
    };
  } catch (error) {
    console.warn(
      `Could not read the current website ${normalizedUrl}:`,
      error instanceof Error ? error.message : error,
    );

    return null;
  }
};
