import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import { auditCompanies } from 'src/logic-functions/utils/audit-companies';
import { extractCompanyIds } from 'src/logic-functions/utils/extract-company-ids';

// For companies that existed before the app, or came in by CSV import without a created event.
const handler = async (input: unknown) => {
  const companyIds = extractCompanyIds(input);

  if (companyIds.length === 0) {
    return { success: false, message: 'No companies selected.' };
  }

  return { success: true, ...(await auditCompanies(companyIds)) };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.auditSelectedCompanies.universalIdentifier,
  name: 'audit-selected-companies',
  description: 'Re-scores the website, size and price of the selected Companies.',
  timeoutSeconds: 900,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.auditSelectedCompanies.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  workflowActionTriggerSettings: {
    label: 'Audit websites',
    icon: 'IconGauge',
    inputSchema: [
      {
        type: 'object',
        properties: {
          records: {
            type: 'records',
            objectUniversalIdentifier:
              STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
            label: 'Companies',
          },
        },
      },
    ],
    outputSchema: [
      {
        type: 'object',
        properties: {
          success: { type: 'boolean', label: 'Success' },
          audited: { type: 'number', label: 'Audited' },
          pitchSitesQueued: { type: 'number', label: 'Pitch sites queued' },
        },
      },
    ],
  },
});
