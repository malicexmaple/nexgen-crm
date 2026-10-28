export const APP_DISPLAY_NAME = 'NEXGEN Lead Engine';
export const APP_DESCRIPTION =
  'Imports local businesses from Google Maps, scores their websites 1-10, sizes and prices the job, and builds AI pitch sites for weak websites.';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'cad5bc35-cde5-4fbe-8376-fbafc6cdc700';
export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  'de2c770d-2deb-4652-a262-3a593896593b';

export const APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS = {
  googlePlacesApiKey: '2ae5327a-ea38-4b66-886c-57f63d62dd02',
  anthropicApiKey: '53735970-a4c6-4499-a4f2-118297d7b2f8',
  currencyCode: 'f0b2efcb-8e47-4106-bc41-5054645664ef',
  autoGeneratePitchSites: '255ad382-b781-48c6-9e35-0847fdcf2f00',
  pitchSiteMaxScore: 'fd59bc26-6395-403f-8b2e-a5fac9b09e85',
  pitchSiteModel: 'cdb7ef65-ea54-4f1c-9814-1e33b0c21708',
} as const;

export const COMPANY_FIELD_UNIVERSAL_IDENTIFIERS = {
  googlePlaceId: '71985227-69da-44d6-b2fc-7ee0fa149661',
  googleCategory: 'e510d196-0a7a-42b2-b1f6-46e93e0c97b1',
  googleRating: 'cc24a5e5-7038-4903-8f07-6e36ff5a2273',
  googleReviewCount: 'f93b15c3-af9a-41ab-83e7-c592817117b1',
  googleMapsUrl: '470eae14-cc14-4bcc-96ed-fbad440ef4f0',
  phone: '65151d60-d94c-4246-96ce-625eaa282e2f',
  websiteScore: '5971b8b1-c872-40ff-a810-28dd73226b39',
  websiteIssues: '7ac771f3-f94d-449f-a50c-34fbe358d538',
  websiteCheckedAt: '3be2b05c-fa83-4b47-8ba0-32ce230a3a8b',
  sizeTier: '8a0bfd0c-7eed-4947-a837-65b446556a44',
  complexityTier: '1bb4351f-5bfd-4cba-93c4-fae2e082539f',
  estimatedPrice: 'd19f316e-bb39-4613-a91d-2af4ed22dc11',
  leadPriority: '32aeaf55-1860-4da7-be0d-fa98f903807d',
  leadStatus: '500ab9b2-57c1-4433-8bf4-65a5c8bb12f3',
  pitchSiteUrl: 'a1f16777-fae5-46f7-86ea-32351553de62',
} as const;

export const SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  sizeTier: {
    SMALL: 'a2479685-8e72-4c8a-867a-9fff86db1d97',
    MEDIUM: 'a9984788-4c3e-4ce8-9d05-902ec9923973',
    LARGE: '24390a21-c9c7-4cb5-9049-16556f07b6cc',
  },
  complexityTier: {
    BASIC: 'c2e7ff70-9d14-43f1-8d7a-c8a99792315e',
    STANDARD: 'eba70065-258f-45f4-8453-de8947e1f2b1',
    ADVANCED: '68fa7e65-07a3-4238-aef5-06a77e4b20af',
  },
  leadStatus: {
    NEW: '55bf6ecc-f54d-49af-b9bf-f2ef81a6ae53',
    AUDITED: '0e978c07-bfcf-45dd-a5ba-689a8a68d3ab',
    PITCH_READY: '567205a9-0349-49bd-898e-674fb262fec7',
    CALLED: '26ce19b1-17db-440e-8b95-0f5fb0f344fd',
    FOLLOW_UP: '3aed8e92-6508-49d5-8ea3-c6ebe8855944',
    WON: '34d88946-c215-46de-baf8-c33ba0accb61',
    LOST: '095c6903-8870-413f-ab53-35691dc39266',
  },
} as const;

export const LOGIC_FUNCTIONS = {
  scanArea: {
    universalIdentifier: '939cb200-3d93-4944-9413-6b99e7a5b7f6',
    path: '/nexgen/scan-area',
  },
  auditCreatedCompanies: {
    universalIdentifier: '5e809020-7eb6-4e3e-bf3e-83898aef5cbe',
  },
  auditUpdatedCompanies: {
    universalIdentifier: '868d2a93-072d-4e66-892b-78b8df7b4211',
  },
  auditSelectedCompanies: {
    universalIdentifier: '2dadb00c-6e3d-415e-b384-97c1e77786c9',
    path: '/nexgen/audit-companies',
  },
  generatePitchSites: {
    universalIdentifier: '18940945-bbdc-4993-8bb6-1b5afa4c4f1c',
    path: '/nexgen/generate-pitch-sites',
  },
  buildPitchSite: {
    universalIdentifier: '1342074e-8252-4d8c-81a7-25c63a708bff',
  },
  servePitchSite: {
    universalIdentifier: '0d871f59-68a9-4be4-b79f-dccf15c6932a',
    path: '/nexgen/pitch/:companyId',
  },
} as const;

export const VIEW_UNIVERSAL_IDENTIFIERS = {
  callQueue: 'c4597e66-c0b2-4fc9-ad74-fd18f423d128',
  leadPipeline: '473e29d1-8914-4a56-ad24-23f09a165f3c',
} as const;

export const CALL_QUEUE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '12628b34-5bc4-4812-bb8f-517424512897',
  phone: '83fc2bbf-06de-457f-ba08-4819c4f12186',
  leadPriority: '0b713300-3ab0-4f1b-b319-2b84cb45839d',
  websiteScore: '4c713b93-f817-47dc-a8cc-0023cc64d285',
  estimatedPrice: 'a6c004c0-f268-4e4b-b0e7-ea4d0a67e22f',
  sizeTier: '7dfd3a2c-bf4d-4a6a-9a24-ec4de04e5b34',
  complexityTier: '756ed9e6-572c-4450-968a-9531e8514439',
  leadStatus: '4c31fc28-0813-457c-bcc1-d726e0020817',
  pitchSiteUrl: '370a30e4-6e6a-492b-af48-1acea929886d',
  websiteIssues: 'cfd9e7dc-6a37-4a6f-81bc-35b2394aa52d',
  domainName: '13bc72e0-7085-4402-9af1-32b5ecbb9ef9',
  googleCategory: '6d844aa2-8615-40e8-b0ce-91566d60b47d',
} as const;

export const LEAD_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '5446801b-1004-49ba-85a8-812dd59f8201',
  estimatedPrice: '63d5b0ed-d3a3-45fa-9d79-9f372ef799a3',
  websiteScore: 'eba672d7-a788-4d6b-bc0c-34ea539e9d2c',
  phone: '8e23dd74-33c5-4328-9405-c261d644b794',
  pitchSiteUrl: 'e7a664b0-e138-43f5-94a2-ed74954a29e8',
  leadStatus: 'be3c92f0-f6fe-42b0-a3b3-30fdde67b6c0',
} as const;

export const LEAD_PIPELINE_VIEW_GROUP_UNIVERSAL_IDENTIFIERS = {
  NEW: '46bec221-0731-4a7f-beaa-71663ab729aa',
  AUDITED: '67024dc3-bc7e-4330-937b-51d0f7baad6a',
  PITCH_READY: 'f6674b93-cea0-4794-8b9e-808a1c36c229',
  CALLED: '519601da-fc05-4ec5-9789-9a266e7f38c5',
  FOLLOW_UP: '0185c386-14e2-4514-bf53-b7df0ab183c7',
  WON: '6a22ebe2-e556-4006-b36a-01cbe1ecae7a',
  LOST: '1abadb9d-fd79-4cde-b3c7-2756984b3a51',
} as const;

export const CALL_QUEUE_SORT_UNIVERSAL_IDENTIFIER =
  'ac090f88-9156-487b-a5de-5c1bff5c84da';

export const NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  callQueue: '88196f10-82e6-431f-8116-d45fbaee7af0',
  leadPipeline: 'ab9dda52-df8b-4ead-98a3-996131f3e41d',
} as const;
