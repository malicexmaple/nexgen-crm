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
  SPOKEN_TO_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const STANDARD_FIELDS = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const COLUMNS: [keyof typeof VIEW_FIELD_IDS, string, number?][] = [
  ['name', STANDARD_FIELDS.name.universalIdentifier, 200],
  ['people', STANDARD_FIELDS.people.universalIdentifier, 160],
  ['phone', FIELD_IDS.phone, 160],
  ['answeredAt', FIELD_IDS.answeredAt, 150],
  ['callAttempt', FIELD_IDS.callAttempt, 110],
  ['lastCalledBy', FIELD_IDS.lastCalledBy, 160],
  ['lastCallOutcome', FIELD_IDS.lastCallOutcome, 140],
  ['totalCallAttempts', FIELD_IDS.totalCallAttempts, 120],
  ['leadStatus', FIELD_IDS.leadStatus, 130],
];

export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.spokenTo,
  name: 'SPOKEN TO',
  icon: 'IconPhoneIncoming',
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
      universalIdentifier: FILTER_IDS.spokenToStatus,
      fieldMetadataUniversalIdentifier: FIELD_IDS.callingStatus,
      operand: ViewFilterOperand.IS,
      value: ['SPOKEN_TO'],
    },
  ],
  sorts: [
    {
      universalIdentifier: SORT_IDS.spokenToAnsweredAt,
      fieldMetadataUniversalIdentifier: FIELD_IDS.answeredAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
