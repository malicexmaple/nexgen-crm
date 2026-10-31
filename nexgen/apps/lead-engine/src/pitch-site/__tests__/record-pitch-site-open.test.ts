import { type CoreApiClient } from 'twenty-client-sdk/core';

import { isProspectOpen, recordPitchSiteOpen } from 'src/pitch-site/record-pitch-site-open';

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

const fakeClient = (company: { pitchSiteOpens: number | null; pitchSiteLastOpenedAt: string | null } | null) => {
  const mutation = vi.fn(async () => ({}));
  const client = {
    query: vi.fn(async () => ({ companies: { edges: company === null ? [] : [{ node: company }] } })),
    mutation,
  } as unknown as CoreApiClient;

  return { client, mutation };
};

describe('isProspectOpen', () => {
  it('counts a person opening the link from a text message or email', () => {
    expect(isProspectOpen({ 'user-agent': IPHONE_SAFARI, 'sec-fetch-site': 'none' })).toBe(true);
    expect(isProspectOpen({ 'user-agent': IPHONE_SAFARI, 'sec-fetch-site': 'cross-site' })).toBe(true);
  });

  it('ignores link previews, crawlers and missing user agents', () => {
    expect(isProspectOpen({ 'user-agent': 'facebookexternalhit/1.1 Facebot Twitterbot/1.0' })).toBe(false);
    expect(isProspectOpen({ 'user-agent': 'WhatsApp/2.24.1 A' })).toBe(false);
    expect(isProspectOpen({ 'user-agent': 'Mozilla/5.0 (compatible; GoogleImageProxy)' })).toBe(false);
    expect(isProspectOpen({})).toBe(false);
  });

  it('ignores clicks from inside the CRM and browser prefetches', () => {
    expect(isProspectOpen({ 'user-agent': IPHONE_SAFARI, 'sec-fetch-site': 'same-origin' })).toBe(false);
    expect(isProspectOpen({ 'user-agent': IPHONE_SAFARI, 'sec-purpose': 'prefetch;prerender' })).toBe(false);
  });
});

describe('recordPitchSiteOpen', () => {
  const openedAt = new Date('2026-10-31T01:00:00.000Z');

  it('counts the first open', async () => {
    const { client, mutation } = fakeClient({ pitchSiteOpens: null, pitchSiteLastOpenedAt: null });

    await recordPitchSiteOpen({ client, companyId: 'c1', openedAt });

    expect(mutation).toHaveBeenCalledWith({
      updateCompany: {
        __args: {
          id: 'c1',
          data: { pitchSiteOpens: 1, pitchSiteLastOpenedAt: '2026-10-31T01:00:00.000Z' },
        },
        id: true,
      },
    });
  });

  it('treats a reload within half an hour as the same visit', async () => {
    const { client, mutation } = fakeClient({
      pitchSiteOpens: 2,
      pitchSiteLastOpenedAt: '2026-10-31T00:45:00.000Z',
    });

    await recordPitchSiteOpen({ client, companyId: 'c1', openedAt });

    expect(mutation).not.toHaveBeenCalled();
  });

  it('counts a return visit later on', async () => {
    const { client, mutation } = fakeClient({
      pitchSiteOpens: 2,
      pitchSiteLastOpenedAt: '2026-10-30T22:00:00.000Z',
    });

    await recordPitchSiteOpen({ client, companyId: 'c1', openedAt });

    expect(mutation).toHaveBeenCalledWith(
      expect.objectContaining({
        updateCompany: expect.objectContaining({
          __args: expect.objectContaining({ data: expect.objectContaining({ pitchSiteOpens: 3 }) }),
        }),
      }),
    );
  });
});
