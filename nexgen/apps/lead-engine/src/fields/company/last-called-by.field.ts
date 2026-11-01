import {
  defineField,
  FieldType,
  MetadataWritability,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS,
  WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.lastCalledBy,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'lastCalledBy',
  label: 'Last called by',
  description: 'The salesperson who recorded the last call.',
  icon: 'IconUsers',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS.lastCalledLeads,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'lastCalledById',
  },
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
