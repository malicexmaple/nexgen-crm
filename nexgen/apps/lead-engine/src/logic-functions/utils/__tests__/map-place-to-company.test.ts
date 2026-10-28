import {
  isOperationalPlace,
  mapPlaceToCompanyData,
} from 'src/logic-functions/utils/map-place-to-company';
import { extractCompanyIds } from 'src/logic-functions/utils/extract-company-ids';

describe('mapPlaceToCompanyData', () => {
  it('maps a full Google place to company fields', () => {
    expect(
      mapPlaceToCompanyData({
        id: 'ChIJ123',
        displayName: { text: ' Acme Plumbing ' },
        postalAddress: {
          regionCode: 'US',
          postalCode: '75201',
          administrativeArea: 'TX',
          locality: 'Dallas',
          addressLines: ['100 Main St'],
        },
        location: { latitude: 32.78, longitude: -96.8 },
        nationalPhoneNumber: '(214) 555-0100',
        internationalPhoneNumber: '+1 214-555-0100',
        websiteUri: 'http://acmeplumbing.example/',
        googleMapsUri: 'https://maps.google.com/?cid=1',
        rating: 4.6,
        userRatingCount: 87,
        primaryType: 'plumber',
      }),
    ).toEqual({
      name: 'Acme Plumbing',
      googlePlaceId: 'ChIJ123',
      googleCategory: 'plumber',
      googleRating: 4.6,
      googleReviewCount: 87,
      leadStatus: 'NEW',
      domainName: {
        primaryLinkUrl: 'http://acmeplumbing.example/',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      googleMapsUrl: {
        primaryLinkUrl: 'https://maps.google.com/?cid=1',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      phone: {
        primaryPhoneNumber: '214-555-0100',
        primaryPhoneCallingCode: '+1',
        primaryPhoneCountryCode: 'US',
        additionalPhones: null,
      },
      address: {
        addressStreet1: '100 Main St',
        addressStreet2: '',
        addressCity: 'Dallas',
        addressPostcode: '75201',
        addressState: 'TX',
        addressCountry: 'US',
        addressLat: 32.78,
        addressLng: -96.8,
      },
    });
  });

  it('leaves out the website when the business has none', () => {
    const data = mapPlaceToCompanyData({ id: 'ChIJ456', displayName: { text: 'Bob' } });

    expect(data.domainName).toBeUndefined();
    expect(data.phone).toBeUndefined();
    expect(data.googleReviewCount).toBe(0);
  });

  it('skips permanently closed businesses', () => {
    expect(isOperationalPlace({ id: 'a', businessStatus: 'CLOSED_PERMANENTLY' })).toBe(false);
    expect(isOperationalPlace({ id: 'b' })).toBe(true);
  });
});

describe('extractCompanyIds', () => {
  it('reads ids from an HTTP route payload, a workflow action and a job', () => {
    expect(
      extractCompanyIds({ requestContext: {}, body: { companyIds: ['a', 'b'] } }),
    ).toEqual(['a', 'b']);
    expect(extractCompanyIds({ records: [{ id: 'c' }, 'd'] })).toEqual(['c', 'd']);
    expect(extractCompanyIds({ companyIds: ['e', 'e'] })).toEqual(['e']);
    expect(extractCompanyIds(null)).toEqual([]);
  });
});
