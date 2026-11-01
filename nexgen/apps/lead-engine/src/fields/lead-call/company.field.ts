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
  LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS,
  LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS.company,
  objectUniversalIdentifier: LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'company',
  label: 'Lead',
  description: 'The business that was called.',
  icon: 'IconBuildingSkyscraper',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.leadCalls,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'companyId',
  },
  writability: MetadataWritability.APPLICATION,
});
