import {
  defineField,
  FieldType,
  MetadataWritability,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS,
  LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS.calledBy,
  objectUniversalIdentifier: LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'calledBy',
  label: 'Salesperson',
  description: 'Who recorded the call.',
  icon: 'IconUsers',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS.leadCalls,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'calledById',
  },
  writability: MetadataWritability.APPLICATION,
});
