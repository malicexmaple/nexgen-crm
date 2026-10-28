import { kv } from 'twenty-sdk/logic-function';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getPitchSiteKey = (companyId: string) => `pitch-site:${companyId}`;

export const isCompanyId = (value: unknown): value is string =>
  typeof value === 'string' && UUID_PATTERN.test(value);

export const savePitchSiteHtml = (companyId: string, html: string) =>
  kv.set(getPitchSiteKey(companyId), html);

export const loadPitchSiteHtml = (companyId: string) =>
  kv.get<string>(getPitchSiteKey(companyId));

export const buildPitchSiteUrl = (companyId: string): string => {
  const serverUrl = (process.env.TWENTY_API_URL ?? '').replace(/\/+$/, '');

  return `${serverUrl}/s/nexgen/pitch/${companyId}`;
};
