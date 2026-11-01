import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.callClaimedById,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.UUID,
  name: 'callClaimedById',
  label: 'Being called by',
  description: 'Workspace member whose calling screen is showing this lead.',
  icon: 'IconUsers',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
  isAuditLogged: false,
});
