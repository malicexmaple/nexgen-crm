import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DEFAULT_CALLING_TIME_ZONE } from 'src/constants/settings';
import {
  CALLING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS as LAYOUT_IDS,
  CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  CALLING_REPORT_WIDGET_UNIVERSAL_IDENTIFIERS as WIDGET_IDS,
  COMPANY_FIELD_UNIVERSAL_IDENTIFIERS as COMPANY_FIELD_IDS,
  LEAD_CALL_FIELD_UNIVERSAL_IDENTIFIERS as LEAD_CALL_FIELD_IDS,
  LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const COMPANY_OBJECT_ID = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier;
const COMPANY_NAME_FIELD_ID =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name.universalIdentifier;

const CHART_DEFAULTS = {
  timezone: DEFAULT_CALLING_TIME_ZONE,
  firstDayOfTheWeek: 1,
} as const;

const gridPosition = (row: number, column: number, rowSpan: number, columnSpan: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

const BAR_CHART_DEFAULTS = {
  ...CHART_DEFAULTS,
  layout: 'VERTICAL',
  axisNameDisplay: 'NONE',
  color: 'auto',
} as const;

// Reverting a DNQ or Spoken to lead is logged as a Call too, but is not a call.
const REAL_CALLS_FILTER = {
  recordFilters: [
    {
      fieldMetadataUniversalIdentifier: LEAD_CALL_FIELD_IDS.outcome,
      operand: 'IS_NOT',
      value: '["REACTIVATED"]',
    },
    {
      fieldMetadataUniversalIdentifier: LEAD_CALL_FIELD_IDS.undoneAt,
      operand: 'IS_EMPTY',
      value: '',
    },
  ],
};

const statusCountWidget = (
  universalIdentifier: string,
  title: string,
  callingStatus: string,
  column: number,
) => ({
  universalIdentifier,
  title,
  type: 'GRAPH' as const,
  objectUniversalIdentifier: COMPANY_OBJECT_ID,
  position: gridPosition(0, column, 2, 2),
  configuration: {
    configurationType: 'AGGREGATE_CHART' as const,
    aggregateFieldMetadataUniversalIdentifier: COMPANY_NAME_FIELD_ID,
    aggregateOperation: AggregateOperations.COUNT,
    displayDataLabel: true,
    ...CHART_DEFAULTS,
    filter: {
      recordFilters: [
        {
          fieldMetadataUniversalIdentifier: COMPANY_FIELD_IDS.callingStatus,
          operand: 'IS',
          value: JSON.stringify([callingStatus]),
        },
      ],
    },
  },
});

const callsBarChartWidget = (
  universalIdentifier: string,
  title: string,
  groupByFieldUniversalIdentifier: string,
  row: number,
  column: number,
) => ({
  universalIdentifier,
  title,
  type: 'GRAPH' as const,
  objectUniversalIdentifier: LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
  position: gridPosition(row, column, 5, 6),
  configuration: {
    configurationType: 'BAR_CHART' as const,
    aggregateFieldMetadataUniversalIdentifier: LEAD_CALL_FIELD_IDS.requestId,
    aggregateOperation: AggregateOperations.COUNT,
    primaryAxisGroupByFieldMetadataUniversalIdentifier: groupByFieldUniversalIdentifier,
    primaryAxisOrderBy: 'VALUE_DESC',
    ...BAR_CHART_DEFAULTS,
    filter: REAL_CALLS_FILTER,
  },
});

export default definePageLayout({
  universalIdentifier: LAYOUT_IDS.pageLayout,
  name: 'Calling',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: LAYOUT_IDS.callTab,
      title: 'Call',
      position: 0,
      icon: 'IconPhoneCall',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: LAYOUT_IDS.callingPanelWidget,
          title: 'Calling',
          type: 'FRONT_COMPONENT',
          heightBehavior: 'TAB_VIEWPORT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
    {
      universalIdentifier: LAYOUT_IDS.reportsTab,
      title: 'Reports',
      position: 1,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        statusCountWidget(WIDGET_IDS.readyCount, 'Ready to call', 'READY', 0),
        statusCountWidget(WIDGET_IDS.snoozedCount, 'Snoozed', 'SNOOZED', 2),
        statusCountWidget(WIDGET_IDS.nurtureCount, 'In Nurture', 'NURTURE', 4),
        statusCountWidget(WIDGET_IDS.spokenToCount, 'Spoken to', 'SPOKEN_TO', 6),
        statusCountWidget(WIDGET_IDS.dnqCount, 'DNQ', 'DISQUALIFIED', 8),
        {
          universalIdentifier: WIDGET_IDS.totalCalls,
          title: 'Calls recorded',
          type: 'GRAPH',
          objectUniversalIdentifier: LEAD_CALL_OBJECT_UNIVERSAL_IDENTIFIER,
          position: gridPosition(0, 10, 2, 2),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: LEAD_CALL_FIELD_IDS.requestId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            ...CHART_DEFAULTS,
            filter: REAL_CALLS_FILTER,
          },
        },
        callsBarChartWidget(
          WIDGET_IDS.callsBySalesperson,
          'Calls by salesperson',
          LEAD_CALL_FIELD_IDS.calledBy,
          2,
          0,
        ),
        callsBarChartWidget(
          WIDGET_IDS.callsByOutcome,
          'Calls by outcome',
          LEAD_CALL_FIELD_IDS.outcome,
          2,
          6,
        ),
        callsBarChartWidget(
          WIDGET_IDS.callsByCycle,
          'Call attempts by cycle',
          LEAD_CALL_FIELD_IDS.callingCycle,
          7,
          0,
        ),
        {
          universalIdentifier: WIDGET_IDS.recycledLeads,
          title: 'Leads on cycle 2 or later',
          type: 'GRAPH',
          objectUniversalIdentifier: COMPANY_OBJECT_ID,
          position: gridPosition(7, 6, 2, 3),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: COMPANY_NAME_FIELD_ID,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            ...CHART_DEFAULTS,
            filter: {
              recordFilters: [
                {
                  fieldMetadataUniversalIdentifier: COMPANY_FIELD_IDS.callingCycle,
                  operand: 'GREATER_THAN_OR_EQUAL',
                  value: '2',
                },
              ],
            },
          },
        },
      ],
    },
  ],
});
