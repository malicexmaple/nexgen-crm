import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.pitchSiteLastOpenedAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'pitchSiteLastOpenedAt',
  label: 'Site last opened',
  icon: 'IconEye',
  isNullable: true,
});
