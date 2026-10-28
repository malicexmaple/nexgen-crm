import { sanitizePitchSiteHtml } from 'src/pitch-site/sanitize-pitch-site-html';

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
});
