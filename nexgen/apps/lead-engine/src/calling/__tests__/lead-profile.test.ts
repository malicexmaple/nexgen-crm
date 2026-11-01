import { formatPhone, type LeadProfileNode, toLeadProfile } from 'src/calling/lead-profile';

const node = (overrides: Partial<LeadProfileNode>): LeadProfileNode => ({
  domainName: { primaryLinkUrl: 'penrithplumber.au' },
  address: {
    addressStreet1: '69/47 Borec Rd',
    addressStreet2: '',
    addressCity: 'Penrith',
    addressState: 'New South Wales',
    addressPostcode: '2750',
  },
  googleMapsUrl: { primaryLinkUrl: 'https://maps.google.com/?cid=1' },
  googleRating: 5,
  googleReviewCount: 9,
  googleCategory: 'plumber',
  websiteScore: 2,
  websiteIssues: 'No HTTPS; Missing page title ;',
  estimatedPrice: { amountMicros: 1_500_000_000, currencyCode: 'AUD' },
  leadStatus: 'PITCH_READY',
  leadPriority: 63,
  pitchSiteOpens: 1,
  pitchSiteLastOpenedAt: '2026-11-01T02:25:00.000Z',
  people: { edges: [] },
  ...overrides,
});

describe('toLeadProfile', () => {
  it('joins the address, links the website and splits the website problems', () => {
    const profile = toLeadProfile(node({}));

    expect(profile.address).toBe('69/47 Borec Rd, Penrith, New South Wales, 2750');
    expect(profile.websiteUrl).toBe('https://penrithplumber.au');
    expect(profile.websiteIssues).toEqual(['No HTTPS', 'Missing page title']);
    expect(profile.estimatedPrice).toEqual({ amount: 1500, currencyCode: 'AUD' });
  });

  it('lists each contact with their phone link and email', () => {
    const profile = toLeadProfile(
      node({
        people: {
          edges: [
            {
              node: {
                name: { firstName: 'Sam', lastName: 'Ballard' },
                jobTitle: 'Owner',
                emails: { primaryEmail: 'sam@ballards.com.au' },
                phones: { primaryPhoneNumber: '424 907 358', primaryPhoneCallingCode: '+61' },
              },
            },
            {
              node: {
                name: { firstName: '', lastName: '' },
                jobTitle: null,
                emails: { primaryEmail: '' },
                phones: null,
              },
            },
          ],
        },
      }),
    );

    expect(profile.contacts).toEqual([
      {
        name: 'Sam Ballard',
        jobTitle: 'Owner',
        email: 'sam@ballards.com.au',
        phoneNumber: '+61 424 907 358',
        phoneHref: 'tel:+61424907358',
      },
      { name: null, jobTitle: null, email: null, phoneNumber: null, phoneHref: null },
    ]);
  });

  it('copes with a lead that has none of the details yet', () => {
    const profile = toLeadProfile(null);

    expect(profile).toMatchObject({
      address: null,
      websiteUrl: null,
      websiteIssues: [],
      estimatedPrice: null,
      pitchSiteOpens: 0,
      contacts: [],
    });
  });
});

describe('formatPhone', () => {
  it('keeps numbers that already have a country code', () => {
    expect(formatPhone({ primaryPhoneNumber: '+61 2 4722 2035', primaryPhoneCallingCode: '+61' })).toEqual({
      phoneNumber: '+61 2 4722 2035',
      phoneHref: 'tel:+61247222035',
    });
  });
});
