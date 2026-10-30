// Pitch sites are served from the CRM's own origin, so any script in them could read
// a logged-in user's session. Strip everything executable, even though the prompt forbids it.
const DANGEROUS_BLOCK_PATTERN =
  /<(script|iframe|object|applet|frameset|form|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const DANGEROUS_TAG_PATTERN =
  /<\/?(script|iframe|object|embed|frame|frameset|applet|base|form|noscript|template|portal)\b[^>]*>/gi;
const LINK_TAG_PATTERN = /<\/?link\b[^>]*>/gi;
const EVENT_HANDLER_ATTRIBUTE_PATTERN =
  /[\s/]+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_PATTERN =
  /[\s/]+(href|src|action|formaction|xlink:href|values|to|from)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi;
const META_REFRESH_PATTERN = /<meta[^>]+http-equiv\s*=\s*["']?refresh[^>]*>/gi;
// Quoted strings are matched whole because Google Fonts URLs contain semicolons.
const CSS_IMPORT_PATTERN = /@import(?:"[^"]*"|'[^']*'|[^;"'])*;/gi;
const GOOGLE_FONTS_URL_PATTERN = /^https:\/\/fonts\.(?:googleapis|gstatic)\.com(?:\/|$)/i;
const GOOGLE_FONTS_IMPORT_PATTERN =
  /^@import\s+(?:url\(\s*)?(["'])https:\/\/fonts\.googleapis\.com\/[^"']*\1\s*\)?\s*;$/i;

// Google Fonts is the only outside resource a pitch site may load. A link must
// carry exactly one href, so a second unquoted or duplicate href cannot slip past.
const keepGoogleFontsLink = (tag: string): string => {
  const hrefAttributeCount = (tag.match(/\shref\s*=/gi) ?? []).length;
  const quotedHref = /\shref\s*=\s*(["'])([^"']*)\1/i.exec(tag)?.[2];

  return hrefAttributeCount === 1 &&
    quotedHref !== undefined &&
    GOOGLE_FONTS_URL_PATTERN.test(quotedHref)
    ? tag
    : '';
};

const keepGoogleFontsImport = (rule: string): string =>
  GOOGLE_FONTS_IMPORT_PATTERN.test(rule) ? rule : '';

const extractHtmlDocument = (text: string): string => {
  const withoutFences = text
    .replace(/^\s*```(?:html)?\s*/i, '')
    .replace(/```\s*$/, '');
  const documentStart = withoutFences.search(/<!doctype html|<html[\s>]/i);

  return (
    documentStart >= 0 ? withoutFences.slice(documentStart) : withoutFences
  ).trim();
};

export const sanitizePitchSiteHtml = (rawText: string): string => {
  let html = extractHtmlDocument(rawText);
  let previous: string;

  // Repeat until stable so nested or split tags cannot reassemble after one pass.
  do {
    previous = html;
    html = html
      .replace(DANGEROUS_BLOCK_PATTERN, '')
      .replace(DANGEROUS_TAG_PATTERN, '')
      .replace(LINK_TAG_PATTERN, keepGoogleFontsLink)
      .replace(EVENT_HANDLER_ATTRIBUTE_PATTERN, '')
      .replace(JAVASCRIPT_URL_PATTERN, '')
      .replace(META_REFRESH_PATTERN, '')
      .replace(CSS_IMPORT_PATTERN, keepGoogleFontsImport);
  } while (html !== previous);

  return html;
};

// Twenty drops custom headers on route responses, so the policies ride in the page. No referrer
// because images are hotlinked from the business's own site, where hotlink protection can block us.
const SAFETY_META_TAGS =
  '<meta name="referrer" content="no-referrer">' +
  `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; base-uri 'none'; form-action 'none'">`;

export const addPitchSiteSafetyTags = (html: string): string =>
  /<head\b[^>]*>/i.test(html)
    ? html.replace(/<head\b[^>]*>/i, (headTag) => `${headTag}${SAFETY_META_TAGS}`)
    : html.replace(/<html\b[^>]*>/i, (htmlTag) => `${htmlTag}<head>${SAFETY_META_TAGS}</head>`);
