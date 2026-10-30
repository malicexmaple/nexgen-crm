import { fetchGoogleListing } from 'src/pitch-site/fetch-google-listing';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('fetchGoogleListing', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('turns place photos into public photo urls with credits', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/media?')) {
        return jsonResponse({
          photoUri: `https://lh3.googleusercontent.com/${url.includes('photo-a') ? 'a' : 'b'}`,
        });
      }

      return jsonResponse({
        photos: [
          {
            name: 'places/p1/photos/photo-a',
            widthPx: 1600,
            heightPx: 1067,
            authorAttributions: [{ displayName: 'Ballard Plumbing' }],
          },
          { name: 'places/p1/photos/photo-b' },
        ],
      });
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchGoogleListing({ apiKey: 'test-key', googlePlaceId: 'p1' }),
    ).resolves.toEqual({
      photos: [
        {
          url: 'https://lh3.googleusercontent.com/a',
          widthPx: 1600,
          heightPx: 1067,
          credit: 'Ballard Plumbing',
        },
        { url: 'https://lh3.googleusercontent.com/b', widthPx: null, heightPx: null, credit: null },
      ],
      reviews: [],
    });
  });

  it('keeps four and five star reviews in their original words', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({
          reviews: [
            {
              rating: 5,
              originalText: { text: ' Tim had our hot water back on in an hour. ' },
              text: { text: 'Translated wording' },
              authorAttribution: { displayName: 'Sam K' },
              relativePublishTimeDescription: '2 months ago',
            },
            { rating: 4, text: { text: 'Fair price, tidy work.' } },
            { rating: 2, text: { text: 'Turned up late.' }, authorAttribution: { displayName: 'Lee' } },
            { rating: 5, text: { text: '   ' } },
          ],
        }),
      ),
    );
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const { reviews } = await fetchGoogleListing({ apiKey: 'test-key', googlePlaceId: 'p1' });

    expect(reviews).toEqual([
      {
        rating: 5,
        text: 'Tim had our hot water back on in an hour.',
        authorName: 'Sam K',
        publishedAgo: '2 months ago',
      },
      { rating: 4, text: 'Fair price, tidy work.', authorName: null, publishedAgo: null },
    ]);
  });

  it('keeps the photos that resolved when one fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('photo-bad')) {
          return jsonResponse({}, 403);
        }

        if (url.includes('/media?')) {
          return jsonResponse({ photoUri: 'https://lh3.googleusercontent.com/good' });
        }

        return jsonResponse({
          photos: [{ name: 'places/p1/photos/photo-good' }, { name: 'places/p1/photos/photo-bad' }],
        });
      }),
    );
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { photos } = await fetchGoogleListing({ apiKey: 'test-key', googlePlaceId: 'p1' });

    expect(photos.map((photo) => photo.url)).toEqual(['https://lh3.googleusercontent.com/good']);
  });

  it('returns no photos or reviews when Google Maps is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ error: {} }, 403)));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(
      fetchGoogleListing({ apiKey: 'test-key', googlePlaceId: 'p1' }),
    ).resolves.toEqual({ photos: [], reviews: [] });
  });
});
