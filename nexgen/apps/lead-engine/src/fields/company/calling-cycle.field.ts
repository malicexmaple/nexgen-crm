import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.callingCycle,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'callingCycle',
  label: 'Calling cycle',
  description:
    'Goes up each time the lead comes back from Nurture or is moved back to Ready to call.',
  icon: 'IconRepeat',
  isNullable: false,
  defaultValue: 1,
  universalSettings: { decimals: 0 },
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
