import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  CALLING_VIEW_FILTER_UNIVERSAL_IDENTIFIERS as FILTER_IDS,
  CALLING_VIEW_SORT_UNIVERSAL_IDENTIFIERS as SORT_IDS,
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS as FIELD_IDS,
  NURTURE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const STANDARD_FIELDS = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const COLUMNS: [keyof typeof VIEW_FIELD_IDS, string, number?][] = [
  ['name', STANDARD_FIELDS.name.universalIdentifier, 200],
  ['phone', FIELD_IDS.phone, 160],
  ['nextCallAt', FIELD_IDS.nextCallAt, 150],
  ['nurtureReason', FIELD_IDS.nurtureReason, 240],
  ['lastCallOutcome', FIELD_IDS.lastCallOutcome, 140],
  ['lastCallAt', FIELD_IDS.lastCallAt, 150],
  ['lastCalledBy', FIELD_IDS.lastCalledBy, 160],
  ['callingCycle', FIELD_IDS.callingCycle, 110],
  ['totalCallAttempts', FIELD_IDS.totalCallAttempts, 120],
];

export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.nurture,
  name: 'NURTURE',
  icon: 'IconHourglass',
  position: 5,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: COLUMNS.map(([key, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier: VIEW_FIELD_IDS[key],
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
  filters: [
    {
      universalIdentifier: FILTER_IDS.nurtureStatus,
      fieldMetadataUniversalIdentifier: FIELD_IDS.callingStatus,
      operand: ViewFilterOperand.IS,
      value: ['NURTURE'],
    },
  ],
  sorts: [
    {
      universalIdentifier: SORT_IDS.nurtureNextCallAt,
      fieldMetadataUniversalIdentifier: FIELD_IDS.nextCallAt,
      direction: ViewSortDirection.ASC,
    },
  ],
});
