import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import { extractCompanyIds } from 'src/logic-functions/utils/extract-company-ids';
import { queuePitchSites } from 'src/pitch-site/queue-pitch-sites';

// Queues the work: one Claude call can take minutes, longer than an HTTP request should wait.
const handler = async (input: unknown) => {
  const companyIds = extractCompanyIds(input);

  if (companyIds.length === 0) {
    return { success: false, queued: 0, message: 'No companies selected.' };
  }

  await queuePitchSites(companyIds, { rebuild: true });

  return { success: true, queued: companyIds.length };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.generatePitchSites.universalIdentifier,
  name: 'generate-pitch-sites',
  description: 'Builds an AI pitch site for each selected Company.',
  timeoutSeconds: 60,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.generatePitchSites.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  workflowActionTriggerSettings: {
    label: 'Build pitch sites',
    icon: 'IconWorldWww',
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
          queued: { type: 'number', label: 'Queued' },
        },
      },
    ],
  },
});
