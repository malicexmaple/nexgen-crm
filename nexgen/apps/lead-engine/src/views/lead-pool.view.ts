import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewOpenRecordIn,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { CALLING_STATUS_OPTIONS } from 'src/constants/select-options';
import {
  CALLING_VIEW_FILTER_UNIVERSAL_IDENTIFIERS as FILTER_IDS,
  CALLING_VIEW_SORT_UNIVERSAL_IDENTIFIERS as SORT_IDS,
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS as FIELD_IDS,
  LEAD_POOL_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  LEAD_POOL_VIEW_GROUP_UNIVERSAL_IDENTIFIERS as VIEW_GROUP_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const STANDARD_FIELDS = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const CARD_FIELDS: [keyof typeof VIEW_FIELD_IDS, string][] = [
  ['name', STANDARD_FIELDS.name.universalIdentifier],
  ['phone', FIELD_IDS.phone],
  ['callAttempt', FIELD_IDS.callAttempt],
  ['nextCallAt', FIELD_IDS.nextCallAt],
  ['lastCallAt', FIELD_IDS.lastCallAt],
  ['lastCallOutcome', FIELD_IDS.lastCallOutcome],
  ['lastCalledBy', FIELD_IDS.lastCalledBy],
  ['leadPriority', FIELD_IDS.leadPriority],
];

// Next lead on the Call tab takes the top Ready card, so both sort by Lead priority.
export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.leadPool,
  name: 'Start calling',
  icon: 'IconLayoutKanban',
  position: 7,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.KANBAN,
  openRecordIn: ViewOpenRecordIn.RECORD_PAGE,
  mainGroupByFieldMetadataUniversalIdentifier: FIELD_IDS.callingStatus,
  fields: CARD_FIELDS.map(([key, fieldMetadataUniversalIdentifier], position) => ({
    universalIdentifier: VIEW_FIELD_IDS[key],
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
  })),
  groups: CALLING_STATUS_OPTIONS.map((option, position) => ({
    universalIdentifier: VIEW_GROUP_IDS[option.value],
    fieldValue: option.value,
    position,
    isVisible: true,
  })),
  filters: [
    {
      universalIdentifier: FILTER_IDS.leadPoolPhone,
      fieldMetadataUniversalIdentifier: FIELD_IDS.phone,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
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
