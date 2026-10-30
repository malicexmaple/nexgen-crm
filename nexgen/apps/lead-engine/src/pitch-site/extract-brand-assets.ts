import { isNonEmptyString } from 'src/logic-functions/utils/guards';

const MAX_PHOTO_CANDIDATES = 14;
const MAX_STYLESHEETS = 3;
const MAX_BRAND_COLORS = 5;
const MIN_PHOTO_SIDE_PX = 200;
const PREFERRED_SRCSET_WIDTH_PX = 1200;

const IMAGE_TAG_PATTERN = /<img\b[^>]*>/gi;
const LINK_TAG_PATTERN = /<link\b[^>]*>/gi;
const META_TAG_PATTERN = /<meta\b[^>]*>/gi;
const ANCHOR_TAG_PATTERN = /<a\b[^>]*>/gi;
const STYLE_BLOCK_PATTERN = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const STYLE_ATTRIBUTE_PATTERN = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const BACKGROUND_ATTRIBUTE_PATTERN =
  /\sdata-(?:bg|background|bg-image|background-image)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const CSS_URL_PATTERN = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]+))\s*\)/gi;
const JSON_LD_LOGO_PATTERN = /"logo"\s*:\s*(?:\{[^}]*?"url"\s*:\s*)?"(https?:[^"]+)"/i;
const ATTRIBUTE_PATTERN = /([^\s=/<>"']+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
const CSS_COLOR_PATTERN =
  /#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-z])|rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi;

const RASTER_OR_SVG_EXTENSION_PATTERN = /\.(?:jpe?g|png|webp|svg)(?:$|\?)/i;
const PHOTO_EXTENSION_PATTERN = /\.(?:jpe?g|png|webp)(?:$|\?)/i;
const NON_PHOTO_PATTERN =
  /(?:^|[^a-z])(?:icons?|favicon|logos?|sprite|badges?|payment|visa|mastercard|paypal|afterpay|facebook|instagram|twitter|youtube|linkedin|tiktok|google|arrows?|loader|spinner|placeholder|blank|pixel|avatar|flags?|stars?|ratings?|reviews?)(?:[^a-z]|$)/i;
// Trade associations, payment providers and review sites also put "logo" in their badges.
const THIRD_PARTY_LOGO_PATTERN =
  /partner|sponsor|award|badge|accredit|certif|member|association|fair-?trading|master-?plumbers|google|facebook|instagram|hipages|oneflare|review|payment|afterpay|visa|mastercard|paypal|supplier|brands?\b|client/i;
const OWN_LOGO_CLASS_PATTERN = /custom-logo|site-logo|header-logo|navbar-brand|brand-logo/i;
const LIBRARY_STYLESHEET_PATTERN =
  /bootstrap|font-?awesome|fontawesome|animate|slick|owl|swiper|magnific|pretty|themify|flaticon|icons?|jquery|dashicons|wp-block|woocommerce|fonts\.googleapis/i;
// Some lazy-load plugins append the real URL to the placeholder: data:image/svg+xml,...#}https://...
const LAZY_PLACEHOLDER_PATTERN = /^data:[^#]*#\}(https?:\/\/\S+)$/;
// Palettes that ship with WordPress, Wix, Bootstrap and common themes rather than the brand.
const FRAMEWORK_DEFAULT_COLORS = new Set([
  '#ff6900', '#cf2e2e', '#fcb900', '#0693e3', '#9b51e0', '#00d084', '#7bdcb5', '#8ed1fc', '#f78da7',
  '#116dff', '#3899ec', '#007bff', '#0d6efd', '#dc3545', '#28a745', '#198754', '#ffc107', '#17a2b8',
  '#0dcaf0', '#6610f2', '#6f42c1', '#e83e8c', '#d63384', '#fd7e14', '#20c997', '#0274be', '#046bd2',
  '#1e87f0', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff',
]);
const ABOUT_PAGE_PATTERN = /\/about/i;
const SERVICES_PAGE_PATTERN = /\/(?:our-)?services\/?$/i;
const GALLERY_PAGE_PATTERN = /\/(?:work-?)?(?:gallery|our-work|projects|portfolio)(?:\.\w+)?\/?$/i;
const NAME_STOP_WORDS = new Set([
  'plumbing',
  'plumber',
  'plumbers',
  'services',
  'service',
  'group',
  'company',
  'solutions',
  'limited',
]);

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  nbsp: ' ',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  ndash: '-',
  mdash: '-',
  hellip: '...',
  copy: '(c)',
};

export type WebsiteImage = {
  url: string;
  alt: string | null;
};

export type BrandAssets = {
  logoUrl: string | null;
  photos: WebsiteImage[];
  stylesheetUrls: string[];
  subpageUrls: string[];
  inlineCss: string;
  themeColor: string | null;
};

type ImageTag = {
  position: number;
  url: string;
  attributes: Record<string, string>;
};

export const decodeHtmlEntities = (text: string): string =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const codePoint =
        code[1].toLowerCase() === 'x'
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);

      return codePoint > 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    }

    return HTML_ENTITIES[code.toLowerCase()] ?? entity;
  });

const parseAttributes = (tag: string): Record<string, string> => {
  const attributes: Record<string, string> = {};

  for (const match of tag.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[match[1].toLowerCase()] ??= decodeHtmlEntities(
      match[2] ?? match[3] ?? match[4] ?? '',
    );
  }

  return attributes;
};

const unwrapLazyPlaceholder = (value: string): string =>
  LAZY_PLACEHOLDER_PATTERN.exec(value.trim())?.[1] ?? value.trim();

const isUsableSource = (value: string | undefined): value is string =>
  isNonEmptyString(value) && !value.startsWith('data:');

const resolveUrl = (rawUrl: string | undefined, pageUrl: string): string | null => {
  const source = isNonEmptyString(rawUrl) ? unwrapLazyPlaceholder(rawUrl) : undefined;

  if (!isUsableSource(source)) {
    return null;
  }

  try {
    const url = new URL(source, pageUrl);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }

    // Wix appends resize and AVIF transforms after /v1/; the bare media path serves the original.
    if (url.hostname === 'static.wixstatic.com') {
      url.pathname = url.pathname.replace(/\/v1\/.*$/, '');
    }

    url.hash = '';

    return url.toString();
  } catch {
    return null;
  }
};

const pickFromSrcset = (srcset: string): string | undefined => {
  const candidates = srcset
    .split(/,\s+/)
    .map((candidate) => {
      const [url, descriptor = '1x'] = candidate.trim().split(/\s+/);
      const size = parseFloat(descriptor);

      return {
        url: isNonEmptyString(url) ? unwrapLazyPlaceholder(url) : url,
        width: descriptor.endsWith('w') ? size : null,
        density: descriptor.endsWith('x') ? size : null,
      };
    })
    .filter((candidate) => isUsableSource(candidate.url));

  if (candidates.length === 0) {
    return undefined;
  }

  const byWidth = candidates
    .filter((candidate) => candidate.width !== null)
    .sort((first, second) => (first.width ?? 0) - (second.width ?? 0));

  if (byWidth.length > 0) {
    return (
      byWidth.find((candidate) => (candidate.width ?? 0) >= PREFERRED_SRCSET_WIDTH_PX) ??
      byWidth[byWidth.length - 1]
    ).url;
  }

  return candidates.sort((first, second) => (second.density ?? 1) - (first.density ?? 1))[0]
    .url;
};

// Lazy-loading plugins park the real image in data-* attributes behind a placeholder src.
const pickImageSource = (attributes: Record<string, string>): string | undefined => {
  for (const name of ['data-lazy-srcset', 'data-srcset', 'srcset']) {
    const picked = attributes[name] ? pickFromSrcset(attributes[name]) : undefined;

    if (picked !== undefined) {
      return picked;
    }
  }

  return ['data-lazy-src', 'data-src', 'data-original', 'data-orig-src', 'src']
    .map((name) => (isNonEmptyString(attributes[name]) ? unwrapLazyPlaceholder(attributes[name]) : undefined))
    .find(isUsableSource);
};

const getFileName = (url: string): string => {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '').toLowerCase();
  } catch {
    return '';
  }
};

// The same photo is often linked in several WordPress sizes such as photo-1024x683.jpg.
const getImageKey = (url: string): string =>
  url.replace(/[?#].*$/, '').replace(/-\d+x\d+(?=\.\w+$)/, '').toLowerCase();

const getBusinessNameWords = (businessName: string | null): string[] =>
  (businessName ?? '')
    .toLowerCase()
    .replace(/'s\b|\bpty\b|\bltd\b/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4 && !NAME_STOP_WORDS.has(word));

const collectImageTags = (html: string, pageUrl: string): ImageTag[] => {
  const images: ImageTag[] = [];

  for (const match of html.matchAll(IMAGE_TAG_PATTERN)) {
    const attributes = parseAttributes(match[0]);
    const url = resolveUrl(pickImageSource(attributes), pageUrl);

    if (url !== null) {
      images.push({ position: match.index ?? 0, url, attributes });
    }
  }

  const addCssUrls = (css: string, position: number) => {
    for (const urlMatch of css.matchAll(CSS_URL_PATTERN)) {
      const url = resolveUrl(urlMatch[1] ?? urlMatch[2] ?? urlMatch[3], pageUrl);

      if (url !== null) {
        images.push({ position, url, attributes: {} });
      }
    }
  };

  for (const match of html.matchAll(STYLE_ATTRIBUTE_PATTERN)) {
    addCssUrls(decodeHtmlEntities(match[1] ?? match[2] ?? ''), match.index ?? 0);
  }

  for (const match of html.matchAll(BACKGROUND_ATTRIBUTE_PATTERN)) {
    const url = resolveUrl(match[1] ?? match[2], pageUrl);

    if (url !== null) {
      images.push({ position: match.index ?? 0, url, attributes: {} });
    }
  }

  return images.sort((first, second) => first.position - second.position);
};

const scoreLogo = (image: ImageTag, businessNameWords: string[]): number => {
  const classAndId = `${image.attributes.class ?? ''} ${image.attributes.id ?? ''}`;
  const descriptor =
    `${classAndId} ${image.attributes.alt ?? ''} ${getFileName(image.url)}`.toLowerCase();

  if (
    !RASTER_OR_SVG_EXTENSION_PATTERN.test(image.url) ||
    !/logo/.test(descriptor) ||
    THIRD_PARTY_LOGO_PATTERN.test(descriptor)
  ) {
    return 0;
  }

  return (
    10 +
    (OWN_LOGO_CLASS_PATTERN.test(classAndId) ? 5 : 0) +
    (businessNameWords.some((word) => descriptor.includes(word)) ? 3 : 0)
  );
};

const findLogoUrl = (
  images: ImageTag[],
  html: string,
  pageUrl: string,
  businessName: string | null,
): string | null => {
  const businessNameWords = getBusinessNameWords(businessName);
  let best: { url: string; score: number } | null = null;

  for (const image of images) {
    const score = scoreLogo(image, businessNameWords);

    if (score > 0 && (best === null || score > best.score)) {
      best = { url: image.url, score };
    }
  }

  return best?.url ?? resolveUrl(JSON_LD_LOGO_PATTERN.exec(html)?.[1], pageUrl);
};

const isTooSmall = (attributes: Record<string, string>): boolean =>
  ['width', 'height'].some((name) => {
    const size = parseInt(attributes[name] ?? '', 10);

    return Number.isFinite(size) && size < MIN_PHOTO_SIDE_PX;
  });

export const mergePhotoCandidates = (
  photoLists: WebsiteImage[][],
  logoUrl: string | null,
): WebsiteImage[] => {
  const seenKeys = new Set(logoUrl === null ? [] : [getImageKey(logoUrl)]);

  return photoLists.flat().filter((photo) => {
    const key = getImageKey(photo.url);

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);

    return true;
  });
};

const collectPhotos = (
  images: ImageTag[],
  logoUrl: string | null,
  ogImageUrl: string | null,
): WebsiteImage[] => {
  const seenKeys = new Set(logoUrl === null ? [] : [getImageKey(logoUrl)]);
  const photos: WebsiteImage[] = [];
  const candidates = [
    ...images,
    ...(ogImageUrl === null ? [] : [{ position: Infinity, url: ogImageUrl, attributes: {} }]),
  ];

  for (const image of candidates) {
    const key = getImageKey(image.url);
    const descriptor = `${image.attributes.class ?? ''} ${getFileName(image.url)}`;

    if (
      seenKeys.has(key) ||
      !PHOTO_EXTENSION_PATTERN.test(image.url) ||
      NON_PHOTO_PATTERN.test(descriptor) ||
      isTooSmall(image.attributes)
    ) {
      continue;
    }

    seenKeys.add(key);
    photos.push({
      url: image.url,
      alt: isNonEmptyString(image.attributes.alt) ? image.attributes.alt.trim() : null,
    });
  }

  return photos.slice(0, MAX_PHOTO_CANDIDATES);
};

const collectLinks = (html: string, pageUrl: string) => {
  const stylesheetUrls: string[] = [];
  let ogImageUrl: string | null = null;
  let themeColor: string | null = null;

  for (const match of html.matchAll(LINK_TAG_PATTERN)) {
    const attributes = parseAttributes(match[0]);
    const url = resolveUrl(attributes.href, pageUrl);

    if (
      url !== null &&
      /\bstylesheet\b/i.test(attributes.rel ?? '') &&
      new URL(url).hostname === new URL(pageUrl).hostname &&
      !LIBRARY_STYLESHEET_PATTERN.test(getFileName(url))
    ) {
      stylesheetUrls.push(url);
    }
  }

  for (const match of html.matchAll(META_TAG_PATTERN)) {
    const attributes = parseAttributes(match[0]);
    const name = (attributes.property ?? attributes.name ?? '').toLowerCase();

    if (name === 'og:image' && ogImageUrl === null) {
      ogImageUrl = resolveUrl(attributes.content, pageUrl);
    }

    if (name === 'theme-color' && isNonEmptyString(attributes.content)) {
      themeColor = attributes.content.trim();
    }
  }

  return { stylesheetUrls: stylesheetUrls.slice(0, MAX_STYLESHEETS), ogImageUrl, themeColor };
};

const findSubpageUrls = (html: string, pageUrl: string): string[] => {
  const hostname = new URL(pageUrl).hostname;
  const found = new Map<RegExp, string>();

  for (const match of html.matchAll(ANCHOR_TAG_PATTERN)) {
    const url = resolveUrl(parseAttributes(match[0]).href, pageUrl);

    if (url === null || new URL(url).hostname !== hostname) {
      continue;
    }

    const pathname = new URL(url).pathname;

    for (const pattern of [ABOUT_PAGE_PATTERN, SERVICES_PAGE_PATTERN, GALLERY_PAGE_PATTERN]) {
      if (!found.has(pattern) && pattern.test(pathname)) {
        found.set(pattern, url);
      }
    }
  }

  return [...new Set(found.values())];
};

export const extractBrandAssets = ({
  html,
  pageUrl,
  businessName,
}: {
  html: string;
  pageUrl: string;
  businessName: string | null;
}): BrandAssets => {
  const images = collectImageTags(html, pageUrl);
  const logoUrl = findLogoUrl(images, html, pageUrl, businessName);
  const { stylesheetUrls, ogImageUrl, themeColor } = collectLinks(html, pageUrl);
  const inlineCss = [
    ...[...html.matchAll(STYLE_BLOCK_PATTERN)].map((match) => match[1]),
    ...[...html.matchAll(STYLE_ATTRIBUTE_PATTERN)].map((match) => match[1] ?? match[2] ?? ''),
  ].join('\n');

  return {
    logoUrl,
    photos: collectPhotos(images, logoUrl, ogImageUrl),
    stylesheetUrls,
    subpageUrls: findSubpageUrls(html, pageUrl),
    inlineCss,
    themeColor,
  };
};

const toHex = (red: number, green: number, blue: number) =>
  `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

// Greys, white, black and framework defaults say nothing about a brand.
export const extractBrandColors = (cssTexts: string[]): string[] => {
  const counts = new Map<string, number>();

  for (const match of cssTexts.join('\n').matchAll(CSS_COLOR_PATTERN)) {
    let channels: number[];

    if (match[1] !== undefined) {
      const hex =
        match[1].length === 3
          ? [...match[1]].map((digit) => digit + digit).join('')
          : match[1];

      channels = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    } else {
      channels = [match[2], match[3], match[4]].map((channel) => Math.min(255, Number(channel)));
    }

    const hex = toHex(channels[0], channels[1], channels[2]);

    if (Math.max(...channels) - Math.min(...channels) < 60 || FRAMEWORK_DEFAULT_COLORS.has(hex)) {
      continue;
    }

    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, MAX_BRAND_COLORS)
    .map(([hex]) => hex);
};

export const extractVisibleText = (html: string, maxLength: number): string => {
  const text = decodeHtmlEntities(
    html
      .replace(/<head\b[\s\S]*?<\/head>/i, ' ')
      .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(?:br|\/p|\/div|\/li|\/h[1-6]|\/section|\/header|\/footer|\/tr|\/a|\/button)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  );
  const lines = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 1);

  return [...new Set(lines)].join('\n').slice(0, maxLength);
};
