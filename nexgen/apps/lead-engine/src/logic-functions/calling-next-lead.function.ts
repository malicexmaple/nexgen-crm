import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import { buildLeadCard } from 'src/calling/build-lead-card';
import { findNextDueAt } from 'src/calling/calling-records';
import { EMPTY_RESPONSE, isRecordId, runCallingRoute } from 'src/calling/calling-route';
import { claimNextLead } from 'src/calling/claim-next-lead';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const handler = (event: RoutePayload, context?: LogicFunctionExecutionContext) =>
  runCallingRoute(event, context, async ({ client, actor, body, now }) => {
    const skipCompanyIds = Array.isArray(body.skipCompanyIds)
      ? body.skipCompanyIds.filter(isRecordId)
      : [];
    const lead = await claimNextLead({
      client,
      workspaceMemberId: actor.workspaceMemberId,
      skipCompanyIds,
      now,
    });

    return lead !== null
      ? { ...EMPTY_RESPONSE, lead: await buildLeadCard({ client, lead, actor, now }) }
      : { ...EMPTY_RESPONSE, nextDueAt: await findNextDueAt({ client }) };
  });

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.callingNextLead.universalIdentifier,
  name: 'calling-next-lead',
  description: 'Holds the next Ready to call lead for the salesperson and returns it.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.callingNextLead.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
