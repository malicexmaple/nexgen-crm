import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.nextCallAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'nextCallAt',
  label: 'Next call date',
  description: 'When a snoozed or Nurture lead goes back to Ready to call.',
  icon: 'IconCalendarTime',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
