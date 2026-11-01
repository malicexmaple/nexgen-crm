import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.answeredAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'answeredAt',
  label: 'Date answered',
  description: 'When the business last answered a call.',
  icon: 'IconPhoneIncoming',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
