import { isNonEmptyString, isPlainObject } from 'src/logic-functions/utils/guards';

const PLACES_API_URL = 'https://places.googleapis.com/v1';
const MAX_PHOTOS = 6;
const PHOTO_MAX_WIDTH_PX = 1600;
const REQUEST_TIMEOUT_MS = 10_000;

export type BusinessPhoto = {
  url: string;
  widthPx: number | null;
  heightPx: number | null;
  credit: string | null;
};

type PlacePhoto = {
  name?: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: { displayName?: string }[];
};

const fetchJson = async (
  url: string,
  headers: Record<string, string>,
): Promise<unknown> => {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${new URL(url).pathname}`);
  }

  return response.json();
};

const resolvePhoto = async (
  apiKey: string,
  photo: PlacePhoto,
): Promise<BusinessPhoto | null> => {
  if (!isNonEmptyString(photo.name)) {
    return null;
  }

  const media = await fetchJson(
    `${PLACES_API_URL}/${photo.name}/media?maxWidthPx=${PHOTO_MAX_WIDTH_PX}&skipHttpRedirect=true`,
    { 'X-Goog-Api-Key': apiKey },
  );
  const url = isPlainObject(media) ? media.photoUri : null;

  if (!isNonEmptyString(url)) {
    throw new Error(
      `photo media response had no photoUri (fields: ${isPlainObject(media) ? Object.keys(media).join(', ') : typeof media})`,
    );
  }

  return {
    url,
    widthPx: photo.widthPx ?? null,
    heightPx: photo.heightPx ?? null,
    credit: photo.authorAttributions?.[0]?.displayName ?? null,
  };
};

// Photos make the concept site look like the owner's own business, but a site
// without them is still worth building, so any failure just means no photos.
export const fetchBusinessPhotos = async ({
  apiKey,
  googlePlaceId,
}: {
  apiKey: string;
  googlePlaceId: string;
}): Promise<BusinessPhoto[]> => {
  try {
    const place = await fetchJson(
      `${PLACES_API_URL}/places/${encodeURIComponent(googlePlaceId)}`,
      { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'photos' },
    );
    const photos =
      isPlainObject(place) && Array.isArray(place.photos)
        ? (place.photos as PlacePhoto[]).slice(0, MAX_PHOTOS)
        : [];

    if (photos.length === 0) {
      console.log(
        `Google Maps returned no photos (fields: ${isPlainObject(place) ? Object.keys(place).join(', ') || 'none' : typeof place})`,
      );
    }
    const results = await Promise.allSettled(
      photos.map((photo) => resolvePhoto(apiKey, photo)),
    );
    const firstFailure = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (firstFailure !== undefined) {
      console.warn(
        'Could not load some Google Maps photos:',
        firstFailure.reason instanceof Error ? firstFailure.reason.message : firstFailure.reason,
      );
    }

    return results.flatMap((result) =>
      result.status === 'fulfilled' && result.value !== null ? [result.value] : [],
    );
  } catch (error) {
    console.warn(
      'Could not load Google Maps photos:',
      error instanceof Error ? error.message : error,
    );

    return [];
  }
};
