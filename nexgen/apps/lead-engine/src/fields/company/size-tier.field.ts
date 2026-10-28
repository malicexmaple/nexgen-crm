import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SIZE_TIER_OPTIONS } from 'src/constants/select-options';
import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.sizeTier,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'sizeTier',
  label: 'Business size',
  description: 'Estimated from Google review volume; scales the quote.',
  icon: 'IconBuildingSkyscraper',
  isNullable: true,
  options: SIZE_TIER_OPTIONS,
});
