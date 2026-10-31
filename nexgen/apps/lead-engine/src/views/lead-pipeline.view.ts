import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';

import { LEAD_STATUS_OPTIONS } from 'src/constants/select-options';
import {
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS as FIELD_IDS,
  LEAD_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  LEAD_PIPELINE_VIEW_GROUP_UNIVERSAL_IDENTIFIERS as VIEW_GROUP_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const CARD_FIELDS: [keyof typeof VIEW_FIELD_IDS, string][] = [
  ['name', STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name.universalIdentifier],
  ['estimatedPrice', FIELD_IDS.estimatedPrice],
  ['websiteScore', FIELD_IDS.websiteScore],
  ['phone', FIELD_IDS.phone],
  ['pitchSiteUrl', FIELD_IDS.pitchSiteUrl],
  ['pitchSiteOpens', FIELD_IDS.pitchSiteOpens],
  ['leadStatus', FIELD_IDS.leadStatus],
];

export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.leadPipeline,
  name: 'Lead pipeline',
  icon: 'IconLayoutKanban',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.KANBAN,
  mainGroupByFieldMetadataUniversalIdentifier: FIELD_IDS.leadStatus,
  kanbanAggregateOperation: AggregateOperations.SUM,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: FIELD_IDS.estimatedPrice,
  fields: CARD_FIELDS.map(([key, fieldMetadataUniversalIdentifier], position) => ({
    universalIdentifier: VIEW_FIELD_IDS[key],
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
  })),
  groups: LEAD_STATUS_OPTIONS.map((option, position) => ({
    universalIdentifier: VIEW_GROUP_IDS[option.value],
    fieldValue: option.value,
    position,
    isVisible: true,
  })),
});
