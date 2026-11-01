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
  callingTimeZone: '2a771989-c674-4aa2-ba7e-8489d892b098',
  callingAdminEmails: '12167067-8b1b-4144-a2a4-1996a93858da',
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
  pitchSiteOpens: 'd67a7191-6fb9-4dd4-8897-551e5bb386bd',
  pitchSiteLastOpenedAt: 'cd2992af-3392-4a04-a659-e0554134fe26',
  callOpener: '5f161e73-a53f-4454-89fd-aac16fc01698',
  callingStatus: '9191c5b3-ee75-4122-9c1c-a640c2817cb4',
  callAttempt: '61ad786c-4ea4-495b-9503-476d90c0cf47',
  callingCycle: '396852f5-78d2-49f3-affb-201368fc9069',
  totalCallAttempts: '5a8afcf5-f92f-4f58-acd6-fdad7ecb81ed',
  lastCallAt: '6c02be56-a077-4630-80a9-3ef13fb3f2af',
  lastCallOutcome: '1bb5156a-3c12-446d-b99c-e62238be0c7c',
  nextCallAt: 'f0322b07-232f-42b0-82d4-b0f6bbb1c9b3',
  answeredAt: 'b270d44c-11e4-44bc-b128-aa51624c006a',
  lastCalledBy: '887ef998-6fa4-4e4a-a9db-7fab60636f1c',
  dnqAt: '2d932411-2757-475f-9ffe-540e80072140',
  dnqReason: 'bb424556-44b5-452d-8c04-ed4cec39df31',
  nurtureReason: 'd4177b63-4a7d-4a9e-a153-cb177809aeff',
  lastCallRequestId: '8b02481e-2893-4828-80d6-0bc53693f81b',
  lastCallSnapshot: 'a94ec3ab-545e-4aba-8575-c5061caf6844',
  callClaimedById: 'c5f855f0-64e4-4c10-851f-a272add4bc29',
  callClaimedUntil: '8e32ca15-1ee6-4617-8993-6575c850e8c8',
  leadCalls: '2e638f97-77f6-4509-9038-a97e791ae929',
} as const;

export const WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS = {
  lastCalledLeads: '2c050759-b30d-4d56-ab07-0d8ff0c33e62',
  leadCalls: 'fada260f-cb0e-4509-8455-f83d2572bab4',
} as const;

export const LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER =
  '92ce6e1a-9b1c-43a1-a688-14b916e8249a';

export const LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS = {
  company: '65b379d5-ee68-4f7d-b720-b48d7539e946',
  calledBy: 'd109cf28-8053-4e4e-b404-d7e53ffbf259',
  callAttempt: '82083569-2804-4f74-ab39-2cc7a012fff7',
  callingCycle: 'a21e43a8-1fef-468f-9430-39cc2789ebf6',
  outcome: 'b15a996f-9088-4a43-b428-63c0da1304f0',
  calledAt: '96ad6728-01cc-4cdb-af8c-83a9fceda8f0',
  previousStatus: 'ff124664-6ba7-4937-9da7-adb440e45f41',
  newStatus: 'aafbcde8-c1cc-44b7-abcb-dcc2cc7518e9',
  nextCallAt: '808a2ac7-82f1-4854-9690-4165bcc2bb43',
  note: '702f36be-d41c-40a5-9310-7497ee1b114d',
  requestId: '27d33977-4439-4f32-9690-4c7f30009fb1',
  previousState: 'cb162f89-c94b-4fc5-abbc-b945123c684a',
  undoneAt: 'efc4bc0c-93a6-4146-83b3-eefa4b0e39fd',
  undoneBy: '08c96956-f678-4836-be3e-12883ae2a70d',
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
  callingStatus: {
    READY: '924fbe7d-1967-4255-890f-c020c6979513',
    SNOOZED: '1aa3e621-919d-49b3-bcdb-eb5ad9d8b7e0',
    NURTURE: '0d8f36f6-dd50-443b-9aab-ffac42654037',
    SPOKEN_TO: '5288a363-c4f4-42cb-9a41-5b9698d06bd1',
    DISQUALIFIED: '5c8db5b1-f46c-4ca0-afe8-098265e4a79e',
  },
  lastCallOutcome: {
    ANSWERED: 'fa0f122e-1f29-457b-a74a-d9221782d2f6',
    NO_ANSWER: '22795fe0-f73d-41bd-8527-f60f6344ce3e',
    NURTURE: '20f9f4fb-0d03-4afe-a485-6a37d74c4853',
    DNQ: 'c175dbf7-3808-482a-ac57-3d9645ede4f8',
  },
  leadCallOutcome: {
    ANSWERED: '4774b174-adb2-4887-ac79-189d5c66cc67',
    NO_ANSWER: 'cb6894ca-191e-4f6a-82b2-9f8efd168515',
    NURTURE: '89dcbdd0-7ca1-4dc8-90ad-fcb091f57759',
    DNQ: '227995f0-ed5e-440f-a05d-6363c9d25170',
    REACTIVATED: 'f96a1c10-617d-4e1c-85cf-f60bddf43d1a',
  },
  leadCallPreviousStatus: {
    READY: 'a0062276-6ff0-4f63-b0aa-14bfb0c26704',
    SNOOZED: 'f73fc386-bae6-409b-86db-b3db2e6d6020',
    NURTURE: 'f03d1b18-d354-45b8-889d-2ec6867c9ab8',
    SPOKEN_TO: '252f7218-58e8-4457-9029-319fafd40cf4',
    DISQUALIFIED: '211db4e2-f9c9-4f43-b296-fc6cd43f5e81',
  },
  leadCallNewStatus: {
    READY: '3a6af0f5-32b0-4d2e-84c6-5006810d9d45',
    SNOOZED: '46e5da86-c1cc-4d0c-a1e5-674bed77e1f1',
    NURTURE: 'e4bb9547-ff99-4039-a79d-016a9d7e301e',
    SPOKEN_TO: 'e4f0ed06-4e02-4eae-8651-ccde8edaf3de',
    DISQUALIFIED: 'cbe21123-f0eb-4189-b219-6b21358a374f',
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
  callingNextLead: {
    universalIdentifier: 'bebb1fed-0401-4ffe-89c9-6ca5c43d5fce',
    path: '/nexgen/calling/next-lead',
  },
  callingLead: {
    universalIdentifier: '7d3e87c1-b9c9-4224-a917-e4c410b1010c',
    path: '/nexgen/calling/lead',
  },
  callingOutcome: {
    universalIdentifier: '5f744f8c-073b-4f7b-9656-7762798d0257',
    path: '/nexgen/calling/outcome',
  },
  callingUndo: {
    universalIdentifier: '04b3ab06-72ad-4d09-84db-3d81d897a211',
    path: '/nexgen/calling/undo',
  },
  callingRelease: {
    universalIdentifier: 'ed5684e4-c6f3-4006-9a54-0dc2d2c7aa04',
    path: '/nexgen/calling/release',
  },
  callingReactivate: {
    universalIdentifier: 'b39fbeb3-e016-449e-9ecc-96be4c17409c',
    path: '/nexgen/calling/reactivate',
  },
  recycleCallingLeads: {
    universalIdentifier: 'f986b221-ec90-47cc-8524-8a1d62631316',
  },
} as const;

export const CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '0124746b-d82c-4a68-bbf2-83e67928710e';

export const CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS = {
  pageLayout: 'f687d79d-729c-4f9f-bbb0-df9c8b35b738',
  callTab: 'ba3d11f9-2880-4eec-8782-bc206b25a34f',
  reportsTab: '31d446e3-38f9-4cbf-87bd-e97890ef00db',
  callingPanelWidget: '0f9e39fb-517e-402d-a021-f248a839528a',
  companyCallTab: '2bcc0af8-ed9e-4b14-a4e1-ebb31cc8c032',
  companyCallTabWidget: '442543ac-77e4-4905-9ade-afa7eaca2a54',
} as const;

export const CALLING_REPORT_WIDGET_UNIVERSAL_IDENTIFIERS = {
  readyCount: '3d6b0137-d44f-4471-b9c1-19bfc4c04ec0',
  snoozedCount: 'f3359fd3-6efc-4e95-a8a0-741f34f3e341',
  nurtureCount: 'f70c9a6b-b984-4181-8ae6-7079cecb81a9',
  spokenToCount: 'b0e9bccd-30de-4e0d-be61-f6f6d14b0fa6',
  dnqCount: '45ae89f4-3e50-47fa-81ca-a40bff36b2d1',
  totalCalls: 'afc2c177-1c64-441f-9632-a07331d0af52',
  recycledLeads: '648aacea-8a0d-4d4f-8329-4d16605643b0',
  callsBySalesperson: '1563eb68-03d3-4795-945e-bda99c512b9e',
  callsByOutcome: 'fda5e172-e09b-463f-84cc-765b057c72c1',
  callsByCycle: '713be147-1d4b-4781-ab75-0144f7d33767',
} as const;

export const VIEW_UNIVERSAL_IDENTIFIERS = {
  callQueue: '750a2cae-6eec-4d38-8d95-28e41ef5303c',
  leadPipeline: '473e29d1-8914-4a56-ad24-23f09a165f3c',
  readyToCall: 'da9d13b8-90f5-436f-adb4-3a718cd8cd1d',
  spokenTo: 'a989ed04-3b7e-437f-a5fb-e21d512e0cf0',
  nurture: '4383f435-dc40-4aa1-80dd-16a3d3cac5ac',
  disqualified: '31830bfd-a0ec-4c4f-b5bc-a7ea0a6c560e',
} as const;

export const READY_TO_CALL_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: 'ae67b595-95a4-4348-886d-20e7ebfd2a92',
  people: 'f59712d5-c53d-4c5d-9356-e00cebc5af1f',
  phone: '98655118-c210-446a-92a9-250e33cbeee2',
  callAttempt: '20f0e979-6699-4368-96a9-b88ff8b1ae8e',
  lastCallAt: '2b7bcee3-f4a3-408b-b22b-3f1273acb12d',
  lastCallOutcome: '9372d408-26c1-4937-8fe4-d56a52fa92a9',
  totalCallAttempts: '6c27e2c4-8585-462c-bbb5-0c2f52f7d971',
  callingCycle: '7da9ad1e-1998-4e61-8d2f-1b51c201a299',
  leadPriority: '2d251494-db8b-43a2-9cc0-435260280fd1',
  callOpener: 'e5c061bb-0403-4fa2-a304-1d722447b0c4',
  leadStatus: '590924ce-526d-4d42-988c-7be40eeb92d0',
} as const;

export const SPOKEN_TO_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '6d604322-994b-45f3-b91f-f07fca070ebb',
  people: '800aa396-0454-4536-9853-f3ec26778450',
  phone: '9862f380-af76-4ae3-ab9f-1db532739633',
  answeredAt: '52a21b75-ea8a-4bf4-b244-b44d6194d0b0',
  callAttempt: 'a045db42-4ed8-4915-92bf-48c63415e182',
  lastCalledBy: '8555118d-778b-41db-b82a-95d5c5d961fa',
  lastCallOutcome: '2cb62227-cda0-4633-85ac-81acd3b90579',
  totalCallAttempts: 'c218a6b7-3a3f-4447-bc73-84819c144138',
  leadStatus: '2fd24a5e-6a3a-4f7e-8c26-eba7a688fd5c',
} as const;

export const NURTURE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '519a125f-1aac-4361-8b00-b623a4f5ba6c',
  phone: 'dae99681-00a0-4ece-afab-565152b42fa1',
  nextCallAt: 'c09418ee-e104-42ad-a288-58d086127491',
  lastCallOutcome: '7762a276-8c9b-44da-a257-6585f966b7a5',
  lastCallAt: 'b8d08e87-4063-4734-b14c-1cf3e27b438d',
  nurtureReason: '7050ba8a-a1d9-475b-bd2e-5a0a95c72231',
  callingCycle: '48312730-2ea2-4dec-912a-3af8062dd859',
  totalCallAttempts: '6b00d8dc-521f-46b8-9401-6d4f5dd969ce',
  lastCalledBy: '84d2b89d-bb9e-4343-9437-61ba01bfa477',
} as const;

export const DISQUALIFIED_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '16ff0cbd-36b3-4f80-8d0f-942fe70c4bd2',
  phone: 'f577b897-97cd-423b-a569-114752b28923',
  dnqAt: 'acb2ab5a-432c-4946-8232-5e95fe6e70aa',
  dnqReason: '2003e282-d91f-4c5c-a0ce-f5dbd39f453c',
  lastCalledBy: '5a2c2214-0dda-4dd6-aaed-22c7f5ad3f88',
  totalCallAttempts: '4057992d-a037-479f-8203-1be3a7a1ec5d',
  callingCycle: '4ab37fe3-6dd8-4cf1-bc34-92c6d51b378a',
} as const;

export const CALLING_VIEW_FILTER_UNIVERSAL_IDENTIFIERS = {
  readyToCallStatus: '3d68f4ef-3e2d-4d2e-ad17-5bb08ac14eab',
  readyToCallPhone: '5227e032-7107-4a27-b675-3aaa31f3e591',
  readyToCallLeadStatus: '310a1292-b6f5-4632-9fb9-30a1ad9031ba',
  spokenToStatus: '07cd6f6a-00a9-42e1-a053-743208d1e8a0',
  nurtureStatus: '5043aad9-3094-43b0-b77c-f9319fb934f3',
  disqualifiedStatus: 'fad4d4f3-0bf8-4f5b-befa-b9053dc280c9',
} as const;

export const CALLING_VIEW_SORT_UNIVERSAL_IDENTIFIERS = {
  readyToCallLastCallAt: '00c504b7-b3ad-4cf5-a5a4-c4820bd3542c',
  readyToCallCreatedAt: '97209dff-e2dd-4bb3-8e3d-b3b69d53c1b5',
  spokenToAnsweredAt: '39144b85-04bc-4d06-b73b-57555199399d',
  nurtureNextCallAt: 'bf45a7f9-239a-49d9-a4b1-ce5ef18025ce',
  disqualifiedDnqAt: 'e9fcacd8-68a0-4bf5-908c-8ab87a81affa',
} as const;

export const CALL_QUEUE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '55e390ad-b4b1-4b3f-b30f-fcb8799ed70b',
  phone: '099e9d30-3eb3-4bfd-a345-bb0680256780',
  leadPriority: '5e41c81a-b09a-49de-8f2a-57faa7c9b2ff',
  websiteScore: 'fdc90e0a-6384-4728-80fc-b1556845b83c',
  estimatedPrice: 'ab616db2-97c1-46fb-b713-37039da56eb2',
  sizeTier: '8a0db23f-815b-447f-aedf-5f9138cd3b80',
  complexityTier: '3283d396-af48-4301-acf2-2f271baed2f0',
  leadStatus: '5072b44d-0581-40f5-aa69-94a31c73ee02',
  pitchSiteUrl: '2d33cc50-34c6-4d81-a3bf-c2a0bd8466a7',
  websiteIssues: 'fd2982fc-57f7-46fb-885c-f473dc92488f',
  domainName: '3f18c399-367e-4327-aad9-cfc8a5075053',
  googleCategory: '6dcd279c-96ce-4045-bb68-7c95476bc06a',
  pitchSiteOpens: 'b471d67b-4294-401a-9420-246c6a690549',
  pitchSiteLastOpenedAt: 'eec29c88-3517-45c5-9ee0-905b0fb2e050',
  callOpener: 'bc953645-9a1a-43cc-818a-c49a35f06de0',
} as const;

export const LEAD_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '5446801b-1004-49ba-85a8-812dd59f8201',
  estimatedPrice: '63d5b0ed-d3a3-45fa-9d79-9f372ef799a3',
  websiteScore: 'eba672d7-a788-4d6b-bc0c-34ea539e9d2c',
  phone: '8e23dd74-33c5-4328-9405-c261d644b794',
  pitchSiteUrl: 'e7a664b0-e138-43f5-94a2-ed74954a29e8',
  leadStatus: 'be3c92f0-f6fe-42b0-a3b3-30fdde67b6c0',
  pitchSiteOpens: '7f436aef-b304-47a5-adba-b96e5d7be8e5',
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
  'ebed4e35-0501-41e0-8372-12ae215ca93a';

export const NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  callQueue: '9a641f08-5cef-4ea4-8ee5-631b527c0ca2',
  leadPipeline: 'ab9dda52-df8b-4ead-98a3-996131f3e41d',
  callingFolder: '82ecfce1-e864-4d13-8349-ef9015ee4f5c',
  callingPage: 'a312f6d8-425b-4393-bf1e-248ca4e61b3f',
  readyToCall: 'ace079d1-88a9-478a-869b-bd4c3566541b',
  spokenTo: 'e15a42cd-eb5a-4de7-bbd4-0049a5e13044',
  nurture: 'f85d102a-fa00-43cf-8283-59709bb5d6c8',
  disqualified: 'c533f87c-3a8c-4b2b-aead-aaa7d32ead99',
  callHistory: 'd4e5fde1-8db4-4291-adda-90f4c2c70d15',
} as const;
