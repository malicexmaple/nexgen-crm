import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.callClaimedUntil,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'callClaimedUntil',
  label: 'Being called until',
  description: 'Other salespeople skip this lead until then.',
  icon: 'IconClock',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
  isAuditLogged: false,
});
