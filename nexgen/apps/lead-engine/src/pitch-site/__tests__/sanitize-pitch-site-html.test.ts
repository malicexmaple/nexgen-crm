import {
  addPitchSiteSafetyTags,
  sanitizePitchSiteHtml,
} from 'src/pitch-site/sanitize-pitch-site-html';

const wrap = (body: string) =>
  `<!doctype html><html><head><style>body{color:red}</style></head><body>${body}</body></html>`;

describe('sanitizePitchSiteHtml', () => {
  it('keeps a safe document untouched', () => {
    const html = wrap('<header><a href="tel:+12145550100">Call</a></header>');

    expect(sanitizePitchSiteHtml(html)).toBe(html);
  });

  it('strips markdown fences and leading chatter', () => {
    expect(
      sanitizePitchSiteHtml(`Here you go:\n\`\`\`html\n${wrap('<p>Hi</p>')}\n\`\`\``),
    ).toBe(wrap('<p>Hi</p>'));
  });

  it('removes scripts with their content', () => {
    const sanitized = sanitizePitchSiteHtml(
      wrap('<p>a</p><script>fetch("/x?c="+document.cookie)</script><p>b</p>'),
    );

    expect(sanitized).toBe(wrap('<p>a</p><p>b</p>'));
  });

  it('removes scripts that only reassemble after one pass', () => {
    const sanitized = sanitizePitchSiteHtml(
      wrap('<scr<script></script>ipt>alert(1)</script>'),
    );

    expect(sanitized).not.toMatch(/<script/i);
  });

  it('removes event handlers, javascript urls and embeds', () => {
    const sanitized = sanitizePitchSiteHtml(
      wrap(
        '<img src="x" onerror="alert(1)"><svg/onload=alert(1)></svg><a href="javascript:alert(1)">x</a><iframe src="https://evil.example"></iframe><meta http-equiv="refresh" content="0;url=https://evil.example">',
      ),
    );

    expect(sanitized).not.toMatch(/onerror|onload|javascript:|<iframe|http-equiv/i);
    expect(sanitized).toContain('<img src="x">');
  });

  it('removes remote stylesheets', () => {
    const sanitized = sanitizePitchSiteHtml(
      '<!doctype html><html><head><link rel="stylesheet" href="https://evil.example/x.css"><style>@import url("https://evil.example/y.css"); p{margin:0}</style></head><body></body></html>',
    );

    expect(sanitized).not.toMatch(/evil\.example/);
    expect(sanitized).toContain('p{margin:0}');
  });

  it('keeps Google Fonts links and imports', () => {
    const fonts =
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">';
    const fontImport =
      "@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;800&display=swap');";
    const html = `<!doctype html><html><head>${fonts}<style>${fontImport} p{margin:0}</style></head><body></body></html>`;

    expect(sanitizePitchSiteHtml(html)).toBe(html);
  });

  it('removes font links that smuggle in a second href', () => {
    const sanitized = sanitizePitchSiteHtml(
      wrap(
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter" href=https://evil.example/x.css><link rel="stylesheet" data-href="https://fonts.googleapis.com/x" href="https://evil.example/y.css">',
      ),
    );

    expect(sanitized).not.toMatch(/<link|evil\.example/);
  });

  it('removes imports from look-alike font hosts and hidden imports', () => {
    const sanitized = sanitizePitchSiteHtml(
      '<!doctype html><html><head><style>@import url("https://fonts.googleapis.com.evil.example/x.css");@import/**/url(https://evil.example/y.css); p{margin:0}</style></head><body></body></html>',
    );

    expect(sanitized).not.toMatch(/@import|evil\.example/);
    expect(sanitized).toContain('p{margin:0}');
  });
});

describe('addPitchSiteSafetyTags', () => {
  it('puts the referrer and content security policies first in the head', () => {
    expect(
      addPitchSiteSafetyTags('<!doctype html><html lang="en"><head><title>x</title></head></html>'),
    ).toMatch(
      /^<!doctype html><html lang="en"><head><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none';[^"]*"><title>/,
    );
  });

  it('adds a head when the page has none', () => {
    expect(addPitchSiteSafetyTags('<!doctype html><html><body>x</body></html>')).toMatch(
      /^<!doctype html><html><head><meta name="referrer"[^>]*><meta http-equiv[^>]*><\/head><body>/,
    );
  });
});
