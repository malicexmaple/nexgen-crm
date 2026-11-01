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
  READY_TO_CALL_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const STANDARD_FIELDS = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const COLUMNS: [keyof typeof VIEW_FIELD_IDS, string, number?][] = [
  ['name', STANDARD_FIELDS.name.universalIdentifier, 200],
  ['callAttempt', FIELD_IDS.callAttempt, 110],
  ['phone', FIELD_IDS.phone, 160],
  ['people', STANDARD_FIELDS.people.universalIdentifier, 160],
  ['lastCallAt', FIELD_IDS.lastCallAt, 150],
  ['lastCallOutcome', FIELD_IDS.lastCallOutcome, 140],
  ['totalCallAttempts', FIELD_IDS.totalCallAttempts, 120],
  ['callingCycle', FIELD_IDS.callingCycle, 110],
  ['leadPriority', FIELD_IDS.leadPriority, 110],
  ['callOpener', FIELD_IDS.callOpener, 360],
  ['leadStatus', FIELD_IDS.leadStatus, 130],
];

// Same leads as Next lead picks from: Ready, has a phone, not Won or Lost.
// Never-called leads (no last call date) come first, oldest first.
export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.readyToCall,
  name: 'READY TO CALL',
  icon: 'IconPhoneCall',
  position: 3,
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
      universalIdentifier: FILTER_IDS.readyToCallStatus,
      fieldMetadataUniversalIdentifier: FIELD_IDS.callingStatus,
      operand: ViewFilterOperand.IS,
      value: ['READY'],
    },
    {
      universalIdentifier: FILTER_IDS.readyToCallPhone,
      fieldMetadataUniversalIdentifier: FIELD_IDS.phone,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
    {
      universalIdentifier: FILTER_IDS.readyToCallLeadStatus,
      fieldMetadataUniversalIdentifier: FIELD_IDS.leadStatus,
      operand: ViewFilterOperand.IS_NOT,
      value: ['WON', 'LOST'],
    },
  ],
  sorts: [
    {
      universalIdentifier: SORT_IDS.readyToCallLastCallAt,
      fieldMetadataUniversalIdentifier: FIELD_IDS.lastCallAt,
      direction: ViewSortDirection.ASC,
    },
    {
      universalIdentifier: SORT_IDS.readyToCallCreatedAt,
      fieldMetadataUniversalIdentifier: STANDARD_FIELDS.createdAt.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
