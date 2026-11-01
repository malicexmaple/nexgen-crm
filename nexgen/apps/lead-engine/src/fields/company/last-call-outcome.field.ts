import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LAST_CALL_OUTCOME_OPTIONS } from 'src/constants/select-options';
import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.lastCallOutcome,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'lastCallOutcome',
  label: 'Last call outcome',
  description: 'Outcome of the last recorded call.',
  icon: 'IconPhoneCheck',
  isNullable: true,
  options: LAST_CALL_OUTCOME_OPTIONS,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
