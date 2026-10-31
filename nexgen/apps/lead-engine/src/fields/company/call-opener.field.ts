import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.callOpener,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'callOpener',
  label: 'Call opener',
  description: 'What to say first on the call, written when the pitch site is built.',
  icon: 'IconMessageCircle',
  isNullable: true,
});
