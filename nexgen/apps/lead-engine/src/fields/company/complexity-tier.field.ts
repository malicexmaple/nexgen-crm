import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPLEXITY_TIER_OPTIONS } from 'src/constants/select-options';
import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.complexityTier,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'complexityTier',
  label: 'Build complexity',
  description: 'How much development the new site needs; sets the base price.',
  icon: 'IconStack2',
  isNullable: true,
  options: COMPLEXITY_TIER_OPTIONS,
});
