import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CALLING_STATUS_OPTIONS } from 'src/constants/select-options';
import { COMPANY_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FIELD_UNIVERSAL_IDENTIFIERS.callingStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'callingStatus',
  label: 'Calling status',
  description:
    'Where the lead is in the calling pipeline. Changed only by the calling buttons and the scheduled recycler.',
  icon: 'IconPhoneCall',
  isNullable: false,
  defaultValue: "'READY'",
  options: CALLING_STATUS_OPTIONS,
  writability: MetadataWritability.APPLICATION,
  isUIEditable: false,
});
