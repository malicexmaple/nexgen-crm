import {
  extractBrandAssets,
  extractBrandColors,
  extractVisibleText,
  mergePhotoCandidates,
} from 'src/pitch-site/extract-brand-assets';

const PAGE_URL = 'https://www.example-plumbing.com.au/';

const extract = (html: string) =>
  extractBrandAssets({ html, pageUrl: PAGE_URL, businessName: "Ballard's Plumbing Pty Ltd" });

describe('extractBrandAssets', () => {
  it('finds a lazy-loaded logo and skips trade association badges', () => {
    const { logoUrl } = extract(`
      <img src="/img/fair-trading-logo.png" alt="Fair Trading logo">
      <img id="logo-img" class="lazyload" src="data:image/gif;base64,R0lG" data-src="images/logo-img.png" alt="Plumbers in Penrith">
    `);

    expect(logoUrl).toBe('https://www.example-plumbing.com.au/images/logo-img.png');
  });

  it('prefers the logo that matches the business name', () => {
    const { logoUrl } = extract(`
      <img src="/uploads/partner-logo.png" alt="Rheem logo">
      <img src="/uploads/hero-logo.png" alt="Tagline logo">
      <img src="/uploads/ballard-logo.png" alt="Logo">
    `);

    expect(logoUrl).toBe('https://www.example-plumbing.com.au/uploads/ballard-logo.png');
  });

  it('falls back to the logo in structured data', () => {
    const { logoUrl } = extract(
      '<script type="application/ld+json">{"@type":"Plumber","logo":{"@type":"ImageObject","url":"https://cdn.example.com/brand.png"}}</script>',
    );

    expect(logoUrl).toBe('https://cdn.example.com/brand.png');
  });

  it('collects real photos from srcsets, placeholders and backgrounds', () => {
    const { photos } = extract(`
      <div class="hero" style="background-image: url('/uploads/van.jpg')"></div>
      <img src="/uploads/logo.png" class="custom-logo">
      <img srcset="/uploads/job-300x200.jpg 300w, /uploads/job-1536x1024.jpg 1536w, /uploads/job-2048x1365.jpg 2048w" alt="Hot water install">
      <img src="/uploads/job.jpg" alt="Same photo, original size">
      <img src='data:image/svg+xml,%3Csvg%3E%3C/svg%3E#}https://www.example-plumbing.com.au/uploads/drain.jpg' alt="Blocked drain">
      <img src="/icons/phone-icon.png" alt="Phone">
      <img src="/uploads/divider.png" width="49" height="333">
      <meta property="og:image" content="https://www.example-plumbing.com.au/uploads/team.jpg">
    `);

    expect(photos).toEqual([
      { url: 'https://www.example-plumbing.com.au/uploads/van.jpg', alt: null },
      {
        url: 'https://www.example-plumbing.com.au/uploads/job-1536x1024.jpg',
        alt: 'Hot water install',
      },
      { url: 'https://www.example-plumbing.com.au/uploads/drain.jpg', alt: 'Blocked drain' },
      { url: 'https://www.example-plumbing.com.au/uploads/team.jpg', alt: null },
    ]);
  });

  it('asks Wix for the original image instead of a resized AVIF', () => {
    const { photos } = extract(
      '<img src="https://static.wixstatic.com/media/ab12~mv2.jpg/v1/fill/w_238,h_119,enc_avif/job.jpg" alt="Job">',
    );

    expect(photos[0].url).toBe('https://static.wixstatic.com/media/ab12~mv2.jpg');
  });

  it('lists own stylesheets and the about, services and gallery pages', () => {
    const assets = extract(`
      <link rel="stylesheet" href="/css/bootstrap.min.css">
      <link rel="stylesheet" href="/css/home.css">
      <link rel="stylesheet" href="https://other-host.com/theme.css">
      <a href="/about-us.php">About</a>
      <a href="https://other-host.com/about">Elsewhere</a>
      <a href="/services/">Services</a>
      <a href="/services/gas">Gas</a>
      <a href="gallery.php">Work Gallery</a>
    `);

    expect(assets.stylesheetUrls).toEqual(['https://www.example-plumbing.com.au/css/home.css']);
    expect(assets.subpageUrls).toEqual([
      'https://www.example-plumbing.com.au/about-us.php',
      'https://www.example-plumbing.com.au/services/',
      'https://www.example-plumbing.com.au/gallery.php',
    ]);
  });
});

describe('mergePhotoCandidates', () => {
  it('keeps page order and drops repeats, resized copies and the logo', () => {
    expect(
      mergePhotoCandidates(
        [
          [
            { url: 'https://site.au/uploads/van.jpg', alt: 'Van' },
            { url: 'https://site.au/uploads/logo-full.png', alt: null },
          ],
          [
            { url: 'https://site.au/uploads/van-1024x683.jpg', alt: 'Van again' },
            { url: 'https://site.au/uploads/job.jpg', alt: 'Job' },
          ],
        ],
        'https://site.au/uploads/logo-full.png',
      ),
    ).toEqual([
      { url: 'https://site.au/uploads/van.jpg', alt: 'Van' },
      { url: 'https://site.au/uploads/job.jpg', alt: 'Job' },
    ]);
  });
});

describe('extractBrandColors', () => {
  it('ranks saturated colours and ignores greys and framework defaults', () => {
    expect(
      extractBrandColors([
        '.a{color:#dd5405}.b{background:#DD5405}.c{color:#333}.d{color:#ffffff}',
        '.e{border-color:rgb(0, 52, 112)}.f{color:#cf2e2e}.g{color:#f60}',
      ]),
    ).toEqual(['#dd5405', '#003470', '#ff6600']);
  });
});

describe('extractVisibleText', () => {
  it('keeps readable text and drops scripts, styles and repeats', () => {
    const text = extractVisibleText(
      `<head><title>Ignored</title></head><body>
        <nav><a href="/">Home</a><a href="/services">Services</a></nav>
        <script>var tracking = 1;</script><style>.x{}</style>
        <h1>Penrith&rsquo;s plumbers since 1985</h1>
        <p>Licence no.&nbsp;12345</p>
        <footer><a href="/services">Services</a></footer>
      </body>`,
      500,
    );

    expect(text).toBe("Home\nServices\nPenrith's plumbers since 1985\nLicence no. 12345");
  });
});
