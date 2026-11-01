import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewOpenRecordIn,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  CALLING_VIEW_FILTER_UNIVERSAL_IDENTIFIERS as FILTER_IDS,
  CALLING_VIEW_SORT_UNIVERSAL_IDENTIFIERS as SORT_IDS,
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS as FIELD_IDS,
  LEAD_POOL_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const STANDARD_FIELDS = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const COLUMNS: [keyof typeof VIEW_FIELD_IDS, string, number][] = [
  ['name', STANDARD_FIELDS.name.universalIdentifier, 220],
  ['phone', FIELD_IDS.phone, 160],
  ['callAttempt', FIELD_IDS.callAttempt, 100],
  ['leadPriority', FIELD_IDS.leadPriority, 110],
  ['lastCallOutcome', FIELD_IDS.lastCallOutcome, 140],
  ['lastCallAt', FIELD_IDS.lastCallAt, 150],
  ['lastCalledBy', FIELD_IDS.lastCalledBy, 150],
  ['websiteScore', FIELD_IDS.websiteScore, 120],
  ['googleCategory', FIELD_IDS.googleCategory, 160],
  ['domainName', STANDARD_FIELDS.domainName.universalIdentifier, 180],
];

// New leads land here as Ready. Every call outcome moves the lead out; No answer brings
// it back after the snooze. Next lead takes the top row, so both sort by Lead priority.
export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.leadPool,
  name: 'Working Lead Pool',
  icon: 'IconList',
  position: 0,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  openRecordIn: ViewOpenRecordIn.RECORD_PAGE,
  fields: COLUMNS.map(([key, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier: VIEW_FIELD_IDS[key],
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
  filters: [
    {
      universalIdentifier: FILTER_IDS.leadPoolStatus,
      fieldMetadataUniversalIdentifier: FIELD_IDS.callingStatus,
      operand: ViewFilterOperand.IS,
      value: ['READY'],
    },
  ],
  sorts: [
    {
      universalIdentifier: SORT_IDS.leadPoolLeadPriority,
      fieldMetadataUniversalIdentifier: FIELD_IDS.leadPriority,
      direction: ViewSortDirection.DESC,
    },
  ],
});
