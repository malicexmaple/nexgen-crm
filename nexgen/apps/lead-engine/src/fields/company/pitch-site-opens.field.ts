import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.pitchSiteOpens,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'pitchSiteOpens',
  label: 'Site opens',
  description:
    'Times the business opened its pitch site. Opens from inside the CRM, link previews and reloads within 30 minutes are not counted.',
  icon: 'IconEye',
  isNullable: true,
  universalSettings: { decimals: 0 },
});
