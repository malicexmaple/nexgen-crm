import { isPlainObject } from 'src/logic-functions/utils/guards';

const PLACES_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const PAGE_SIZE = 20;
// Text Search returns at most 3 pages (60 places) per query.
export const MAX_PLACES_PER_QUERY = 60;

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.postalAddress',
  'places.location',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.googleMapsUri',
  'places.rating',
  'places.userRatingCount',
  'places.primaryType',
  'places.businessStatus',
  'nextPageToken',
].join(',');

export type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  postalAddress?: {
    regionCode?: string;
    postalCode?: string;
    administrativeArea?: string;
    locality?: string;
    addressLines?: string[];
  };
  location?: { latitude?: number; longitude?: number };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  businessStatus?: string;
};

type TextSearchResponse = {
  places?: GooglePlace[];
  nextPageToken?: string;
  error?: { message?: string };
};

export class GooglePlacesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GooglePlacesError';
  }
}

export const searchGooglePlaces = async ({
  apiKey,
  query,
  maxResults,
}: {
  apiKey: string;
  query: string;
  maxResults: number;
}): Promise<GooglePlace[]> => {
  const limit = Math.min(Math.max(1, maxResults), MAX_PLACES_PER_QUERY);
  const places: GooglePlace[] = [];
  let pageToken: string | undefined;

  do {
    const response = await fetch(PLACES_TEXT_SEARCH_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: Math.min(PAGE_SIZE, limit - places.length),
        ...(pageToken ? { pageToken } : {}),
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as TextSearchResponse;

    if (!response.ok) {
      throw new GooglePlacesError(
        `Google Places search failed (HTTP ${response.status}): ${
          isPlainObject(payload.error) ? payload.error.message : 'no details'
        }`,
      );
    }

    places.push(...(payload.places ?? []));
    pageToken = payload.nextPageToken;
  } while (pageToken && places.length < limit);

  return places.slice(0, limit);
};
