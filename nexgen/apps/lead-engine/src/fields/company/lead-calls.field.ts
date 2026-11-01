import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS,
  LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS,
  LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.leadCalls,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leadCalls',
  label: 'Calls',
  description: 'Every call recorded on this lead, across all calling cycles.',
  icon: 'IconPhoneCall',
  relationTargetObjectMetadataUniversalIdentifier: LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS.company,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
  isUIEditable: false,
});
