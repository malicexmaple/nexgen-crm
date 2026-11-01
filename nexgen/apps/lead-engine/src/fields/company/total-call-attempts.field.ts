import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.totalCallAttempts,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'totalCallAttempts',
  label: 'Total call attempts',
  description:
    'Every call recorded on this lead across all cycles, not counting undone calls.',
  icon: 'IconPhoneOutgoing',
  isNullable: false,
  defaultValue: 0,
  universalSettings: { decimals: 0 },
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
