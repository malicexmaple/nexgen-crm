// Pitch sites are served from the CRM's own origin, so any script in them could read
// a logged-in user's session. Strip everything executable, even though the prompt forbids it.
const DANGEROUS_BLOCK_PATTERN =
  /<(script|iframe|object|applet|frameset|form|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const DANGEROUS_TAG_PATTERN =
  /<\/?(script|iframe|object|embed|frame|frameset|applet|base|form|link|noscript|template|portal)\b[^>]*>/gi;
const EVENT_HANDLER_ATTRIBUTE_PATTERN =
  /[\s/]+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_PATTERN =
  /[\s/]+(href|src|action|formaction|xlink:href|values|to|from)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi;
const META_REFRESH_PATTERN = /<meta[^>]+http-equiv\s*=\s*["']?refresh[^>]*>/gi;
const CSS_REMOTE_IMPORT_PATTERN = /@import[^;]+;/gi;

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
      .replace(EVENT_HANDLER_ATTRIBUTE_PATTERN, '')
      .replace(JAVASCRIPT_URL_PATTERN, '')
      .replace(META_REFRESH_PATTERN, '')
      .replace(CSS_REMOTE_IMPORT_PATTERN, '');
  } while (html !== previous);

  return html;
};
