import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import { buildLeadCard } from 'src/calling/build-lead-card';
import { readCallingLead } from 'src/calling/calling-records';
import {
  EMPTY_RESPONSE,
  readRecordId,
  rejectedResponse,
  runCallingRoute,
} from 'src/calling/calling-route';
import { claimLead } from 'src/calling/claim-next-lead';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const handler = (event: RoutePayload, context?: LogicFunctionExecutionContext) =>
  runCallingRoute(event, context, async ({ client, actor, body, now }) => {
    const companyId = readRecordId(body, 'companyId');
    const lead = companyId !== null ? await readCallingLead({ client, companyId }) : null;

    if (lead === null) {
      return rejectedResponse('This lead could not be found.');
    }

    const shownLead =
      body.claim === true
        ? await claimLead({ client, lead, workspaceMemberId: actor.workspaceMemberId, now })
        : lead;

    return { ...EMPTY_RESPONSE, lead: await buildLeadCard({ client, lead: shownLead, actor, now }) };
  });

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.callingLead.universalIdentifier,
  name: 'calling-lead',
  description: 'Returns the calling details of one lead, holding it for the caller when asked.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.callingLead.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
