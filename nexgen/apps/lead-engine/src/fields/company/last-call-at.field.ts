import {
  DateDisplayFormat,
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.lastCallAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'lastCallAt',
  label: 'Last call date',
  description: 'When the last call outcome was recorded.',
  icon: 'IconCalendarEvent',
  isNullable: true,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
  universalSettings: { displayFormat: DateDisplayFormat.RELATIVE },
});
