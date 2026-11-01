import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.lastCallSnapshot,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'lastCallSnapshot',
  label: 'Last call snapshot',
  description: 'Lets the calling buttons rebuild the last Call record if saving it failed.',
  icon: 'IconHistory',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
  isAuditLogged: false,
});
