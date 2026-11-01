import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS,
  LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS.leadCalls,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leadCalls',
  label: 'Calls made',
  description: 'Calls this member recorded.',
  icon: 'IconPhoneCall',
  relationTargetObjectMetadataUniversalIdentifier: LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS.calledBy,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
  isUIEditable: false,
  isAuditLogged: false,
});
