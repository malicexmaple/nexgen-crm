import { type GooglePlace } from 'src/logic-functions/utils/search-google-places';
import { isNonEmptyString } from 'src/logic-functions/utils/guards';

const INTERNATIONAL_PHONE_PATTERN = /^(\+\d{1,4})\s+(.+)$/;

const buildLinks = (url: string | undefined) =>
  isNonEmptyString(url)
    ? { primaryLinkUrl: url, primaryLinkLabel: '', secondaryLinks: null }
    : undefined;

const buildPhones = (place: GooglePlace) => {
  const internationalMatch = place.internationalPhoneNumber?.match(
    INTERNATIONAL_PHONE_PATTERN,
  );
  const primaryPhoneNumber = internationalMatch?.[2] ?? place.nationalPhoneNumber;

  if (!isNonEmptyString(primaryPhoneNumber)) {
    return undefined;
  }

  return {
    primaryPhoneNumber,
    primaryPhoneCallingCode: internationalMatch?.[1] ?? '',
    primaryPhoneCountryCode: place.postalAddress?.regionCode ?? '',
    additionalPhones: null,
  };
};

const buildAddress = (place: GooglePlace) => {
  const postalAddress = place.postalAddress;

  if (!postalAddress && !isNonEmptyString(place.formattedAddress)) {
    return undefined;
  }

  const [street1 = place.formattedAddress ?? '', street2 = ''] =
    postalAddress?.addressLines ?? [];

  return {
    addressStreet1: street1,
    addressStreet2: street2,
    addressCity: postalAddress?.locality ?? '',
    addressPostcode: postalAddress?.postalCode ?? '',
    addressState: postalAddress?.administrativeArea ?? '',
    addressCountry: postalAddress?.regionCode ?? '',
    addressLat: place.location?.latitude ?? null,
    addressLng: place.location?.longitude ?? null,
  };
};

export const isOperationalPlace = (place: GooglePlace) =>
  !place.businessStatus || place.businessStatus === 'OPERATIONAL';

export const mapPlaceToCompanyData = (place: GooglePlace) => {
  const data: Record<string, unknown> = {
    name: place.displayName?.text?.trim() || 'Unnamed business',
    googlePlaceId: place.id,
    googleCategory: place.primaryType ?? '',
    googleRating: place.rating ?? null,
    googleReviewCount: place.userRatingCount ?? 0,
    leadStatus: 'NEW',
  };

  const domainName = buildLinks(place.websiteUri);
  const googleMapsUrl = buildLinks(place.googleMapsUri);
  const phone = buildPhones(place);
  const address = buildAddress(place);

  if (domainName) data.domainName = domainName;
  if (googleMapsUrl) data.googleMapsUrl = googleMapsUrl;
  if (phone) data.phone = phone;
  if (address) data.address = address;

  return data;
};
