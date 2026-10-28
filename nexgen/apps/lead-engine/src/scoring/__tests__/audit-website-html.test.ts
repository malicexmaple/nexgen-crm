import {
  auditWebsiteHtml,
  type WebsiteFetchResult,
} from 'src/scoring/audit-website-html';

const MODERN_HTML = `<!doctype html><html><head>
<title>Acme Plumbing | Dallas</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="24/7 emergency plumbers in Dallas">
</head><body><a href="tel:+12145550100">Call</a><footer>© 2026 Acme</footer></body></html>`;

const buildFetchResult = (
  overrides: Partial<WebsiteFetchResult> = {},
): WebsiteFetchResult => ({
  ok: true,
  status: 200,
  finalUrl: 'https://acme.example/',
  html: MODERN_HTML,
  responseTimeMs: 400,
  bytes: 50_000,
  ...overrides,
});

describe('auditWebsiteHtml', () => {
  it('scores a missing website as 1', () => {
    expect(
      auditWebsiteHtml({ websiteUrl: null, fetchResult: null, currentYear: 2026 }),
    ).toEqual({ score: 1, issues: ['No website'] });
  });

  it('scores an unreachable website as 2', () => {
    const audit = auditWebsiteHtml({
      websiteUrl: 'https://down.example',
      fetchResult: buildFetchResult({ ok: false, status: 503 }),
      currentYear: 2026,
    });

    expect(audit.score).toBe(2);
    expect(audit.issues[0]).toContain('HTTP 503');
  });

  it('scores a parked domain as 2', () => {
    const audit = auditWebsiteHtml({
      websiteUrl: 'https://acme.example',
      fetchResult: buildFetchResult({
        html: '<html><body>This domain is for sale</body></html>',
      }),
      currentYear: 2026,
    });

    expect(audit.score).toBe(2);
  });

  it('gives a modern site a perfect score', () => {
    expect(
      auditWebsiteHtml({
        websiteUrl: 'https://acme.example',
        fetchResult: buildFetchResult(),
        currentYear: 2026,
      }),
    ).toEqual({ score: 10, issues: [] });
  });

  it('penalises an old, insecure, desktop-only site', () => {
    const audit = auditWebsiteHtml({
      websiteUrl: 'http://acme.example',
      fetchResult: buildFetchResult({
        finalUrl: 'http://acme.example/',
        html: '<html><head><title>Acme</title><script src="jquery-1.4.2.min.js"></script></head><body>Copyright 2014 Acme</body></html>',
        responseTimeMs: 4200,
      }),
      currentYear: 2026,
    });

    expect(audit.score).toBe(1);
    expect(audit.issues).toEqual(
      expect.arrayContaining([
        'No HTTPS: browsers show "Not secure"',
        'Not mobile-friendly (no viewport meta tag)',
        'Copyright year is 2014: site looks abandoned',
        'Slow to respond (4.2s)',
        'Uses outdated web technology',
        'No click-to-call link or contact form',
      ]),
    );
  });

  it('uses the latest year of a copyright range', () => {
    const audit = auditWebsiteHtml({
      websiteUrl: 'https://acme.example',
      fetchResult: buildFetchResult({
        html: MODERN_HTML.replace('© 2026', '&copy; 2009 - 2025'),
      }),
      currentYear: 2026,
    });

    expect(audit.score).toBe(10);
  });
});
