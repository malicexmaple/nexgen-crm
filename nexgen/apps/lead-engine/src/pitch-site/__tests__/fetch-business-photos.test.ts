import { fetchBusinessPhotos } from 'src/pitch-site/fetch-business-photos';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('fetchBusinessPhotos', () => {
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
      fetchBusinessPhotos({ apiKey: 'test-key', googlePlaceId: 'p1' }),
    ).resolves.toEqual([
      {
        url: 'https://lh3.googleusercontent.com/a',
        widthPx: 1600,
        heightPx: 1067,
        credit: 'Ballard Plumbing',
      },
      { url: 'https://lh3.googleusercontent.com/b', widthPx: null, heightPx: null, credit: null },
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

    const photos = await fetchBusinessPhotos({ apiKey: 'test-key', googlePlaceId: 'p1' });

    expect(photos.map((photo) => photo.url)).toEqual(['https://lh3.googleusercontent.com/good']);
  });

  it('returns no photos when Google Maps is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ error: {} }, 403)));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(
      fetchBusinessPhotos({ apiKey: 'test-key', googlePlaceId: 'p1' }),
    ).resolves.toEqual([]);
  });
});
