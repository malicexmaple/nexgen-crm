import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.callAttempt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'callAttempt',
  label: 'Call attempt',
  description: 'The call this lead is on, 1 to 5.',
  icon: 'IconPhone',
  isNullable: false,
  defaultValue: 1,
  universalSettings: { decimals: 0 },
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
