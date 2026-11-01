import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewOpenRecordIn,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  CALL_QUEUE_SORT_UNIVERSAL_IDENTIFIER,
  CALL_QUEUE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS as FIELD_IDS,
  VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const STANDARD_FIELDS =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const COLUMNS: [keyof typeof VIEW_FIELD_IDS, string, number?][] = [
  ['name', STANDARD_FIELDS.name.universalIdentifier, 200],
  ['phone', FIELD_IDS.phone, 160],
  ['leadPriority', FIELD_IDS.leadPriority, 110],
  ['pitchSiteLastOpenedAt', FIELD_IDS.pitchSiteLastOpenedAt, 150],
  ['pitchSiteOpens', FIELD_IDS.pitchSiteOpens, 110],
  ['callOpener', FIELD_IDS.callOpener, 360],
  ['websiteScore', FIELD_IDS.websiteScore, 120],
  ['estimatedPrice', FIELD_IDS.estimatedPrice, 140],
  ['sizeTier', FIELD_IDS.sizeTier, 130],
  ['complexityTier', FIELD_IDS.complexityTier, 150],
  ['leadStatus', FIELD_IDS.leadStatus, 130],
  ['pitchSiteUrl', FIELD_IDS.pitchSiteUrl, 160],
  ['websiteIssues', FIELD_IDS.websiteIssues, 320],
  ['domainName', STANDARD_FIELDS.domainName.universalIdentifier, 180],
  ['googleCategory', FIELD_IDS.googleCategory, 150],
];

export default defineView({
  universalIdentifier: VIEW_UNIVERSAL_IDENTIFIERS.callQueue,
  name: 'Call queue',
  icon: 'IconPhoneCall',
  position: 1,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  openRecordIn: ViewOpenRecordIn.RECORD_PAGE,
  fields: COLUMNS.map(([key, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier: VIEW_FIELD_IDS[key],
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
  sorts: [
    {
      universalIdentifier: CALL_QUEUE_SORT_UNIVERSAL_IDENTIFIER,
      fieldMetadataUniversalIdentifier: FIELD_IDS.leadPriority,
      direction: ViewSortDirection.DESC,
    },
  ],
});
