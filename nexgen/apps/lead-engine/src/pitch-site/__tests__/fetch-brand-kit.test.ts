import { fetchBrandKit } from 'src/pitch-site/fetch-brand-kit';

const JPEG_BYTES = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(20_000)]);
const PNG_BYTES = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(500)]);

const HOMEPAGE = `<html><head><link rel="stylesheet" href="/css/home.css"></head><body>
  <img src="/images/logo.png" id="logo" alt="Ballard's Plumbing">
  <img src="/images/van.jpg" alt="Our van">
  <img src="/images/tiny.jpg" alt="Thumbnail">
  <img src="/images/missing.jpg" alt="Gone">
  <a href="/about-us">About</a>
  <a href="/gallery/">Gallery</a>
  <h1>Ballard's Plumbing, Penrith</h1>
</body></html>`;

const textResponse = (body: string, contentType = 'text/html') =>
  new Response(body, { status: 200, headers: { 'content-type': contentType } });

describe('fetchBrandKit', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('collects the logo, usable photos, colours and page text', async () => {
    const requestedUrls: string[] = [];

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        requestedUrls.push(url);

        switch (new URL(url).pathname) {
          case '/':
            return textResponse(HOMEPAGE);
          case '/css/home.css':
            return textResponse('.btn{background:#dd5405}', 'text/css');
          case '/about-us':
            return textResponse('<p>Family owned since 1985.</p>');
          case '/gallery/':
            return textResponse('<img src="/images/bathroom.jpg" alt="Bathroom job">');
          case '/images/logo.png':
            return new Response(PNG_BYTES);
          case '/images/van.jpg':
          case '/images/bathroom.jpg':
            return new Response(JPEG_BYTES);
          case '/images/tiny.jpg':
            return new Response(JPEG_BYTES.subarray(0, 2000));
          default:
            return new Response('not found', { status: 404 });
        }
      }),
    );

    const brandKit = await fetchBrandKit({
      websiteUrl: 'http://ballards.example.com.au',
      businessName: "Ballard's Plumbing",
    });

    expect(brandKit).toMatchObject({
      logo: {
        url: 'https://ballards.example.com.au/images/logo.png',
        data: { mediaType: 'image/png' },
      },
      photos: [
        {
          url: 'https://ballards.example.com.au/images/van.jpg',
          alt: 'Our van',
          data: { mediaType: 'image/jpeg' },
        },
        {
          url: 'https://ballards.example.com.au/images/bathroom.jpg',
          alt: 'Bathroom job',
          data: { mediaType: 'image/jpeg' },
        },
      ],
      colors: ['#dd5405'],
    });
    expect(brandKit?.text).toContain("Ballard's Plumbing, Penrith");
    expect(brandKit?.text).toContain('/about-us:\nFamily owned since 1985.');
    expect(
      requestedUrls
        .filter((url) => url.includes('/images/'))
        .every((url) => url.startsWith('https://')),
    ).toBe(true);
  });

  it('skips social media profiles listed as the website', async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchBrandKit({
        websiteUrl: 'https://www.facebook.com/share/1Bb2Pr54pu/',
        businessName: 'Bradford Plumbing',
      }),
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns nothing when the website is down', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('timeout');
      }),
    );

    await expect(
      fetchBrandKit({ websiteUrl: 'ballards.example.com.au', businessName: null }),
    ).resolves.toBeNull();
  });
});
