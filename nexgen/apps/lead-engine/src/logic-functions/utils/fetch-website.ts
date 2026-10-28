import { type WebsiteFetchResult } from 'src/scoring/audit-website-html';
import { isNonEmptyString } from 'src/logic-functions/utils/guards';

const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_BYTES = 5_000_000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export const normalizeWebsiteUrl = (
  url: string | null | undefined,
): string | null => {
  if (!isNonEmptyString(url)) {
    return null;
  }

  const trimmed = url.trim();

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const readBodyUpTo = async (response: Response, maxBytes: number) => {
  if (!response.body) {
    return { html: '', bytes: 0 };
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  while (bytes < maxBytes) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    bytes += value.byteLength;
  }

  await reader.cancel().catch(() => undefined);

  return { html: Buffer.concat(chunks).toString('utf8'), bytes };
};

const fetchOnce = async (url: string): Promise<WebsiteFetchResult> => {
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*' },
    });
    const { html, bytes } = await readBodyUpTo(response, MAX_HTML_BYTES);

    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url || url,
      html,
      responseTimeMs: Date.now() - startedAt,
      bytes,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      html: '',
      responseTimeMs: Date.now() - startedAt,
      bytes: 0,
    };
  }
};

// Many small-business sites only answer on plain http, so retry without TLS before giving up.
export const fetchWebsite = async (url: string): Promise<WebsiteFetchResult> => {
  const result = await fetchOnce(url);

  if (result.ok || !url.startsWith('https://')) {
    return result;
  }

  const httpResult = await fetchOnce(url.replace(/^https:\/\//, 'http://'));

  return httpResult.ok ? httpResult : result;
};
