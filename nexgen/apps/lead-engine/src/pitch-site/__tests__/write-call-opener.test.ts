import { type LeadCompany } from 'src/logic-functions/utils/company-records';
import { buildCallOpenerContent, writeCallOpener } from 'src/pitch-site/write-call-opener';

const COMPANY: LeadCompany = {
  id: 'c1',
  name: "Ballard's Plumbing",
  domainName: { primaryLinkUrl: '' },
  address: { addressCity: 'Penrith', addressState: 'NSW', addressCountry: 'Australia' },
  phone: null,
  googlePlaceId: 'p1',
  googleCategory: 'plumber',
  googleRating: 5,
  googleReviewCount: 181,
  websiteScore: 1,
  websiteIssues: 'No website',
  leadStatus: 'AUDITED',
  pitchSiteUrl: null,
};

const messageResponse = (overrides: Record<string, unknown>) =>
  new Response(
    JSON.stringify({
      id: 'msg_1',
      type: 'message',
      role: 'assistant',
      model: 'claude-sonnet-5-5',
      content: [],
      stop_reason: 'end_turn',
      stop_details: null,
      usage: { input_tokens: 1, output_tokens: 1 },
      ...overrides,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );

describe('buildCallOpenerContent', () => {
  it('says plainly when the business has no website', () => {
    expect(buildCallOpenerContent(COMPANY, [])).toContain('Website: none');
  });

  it('includes the rating and reviews to compliment', () => {
    const content = buildCallOpenerContent(COMPANY, [
      { rating: 5, text: 'Fixed our hot water fast.', authorName: 'Sam', publishedAgo: null },
    ]);

    expect(content).toContain('Google rating: 5 from 181 reviews');
    expect(content).toContain('- 5 stars: "Fixed our hot water fast."');
  });
});

describe('writeCallOpener', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns Claude's lines", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        messageResponse({ content: [{ type: 'text', text: ' 181 five-star reviews is a lot. \n' }] }),
      ),
    );

    await expect(writeCallOpener({ apiKey: 'test-key', company: COMPANY, reviews: [] })).resolves.toBe(
      '181 five-star reviews is a lot.',
    );
  });

  it('returns nothing when Claude declines', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => messageResponse({ stop_reason: 'refusal' })));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(
      writeCallOpener({ apiKey: 'test-key', company: COMPANY, reviews: [] }),
    ).resolves.toBeNull();
  });
});
