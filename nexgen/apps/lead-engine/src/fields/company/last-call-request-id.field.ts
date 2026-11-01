import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.lastCallRequestId,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'lastCallRequestId',
  label: 'Last call request',
  description: 'Used by the calling buttons to ignore a click that was already saved.',
  icon: 'IconFingerprint',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
  isAuditLogged: false,
});
