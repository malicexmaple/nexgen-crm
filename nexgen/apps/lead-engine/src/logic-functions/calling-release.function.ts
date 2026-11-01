import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import { EMPTY_RESPONSE, readRecordId, runCallingRoute } from 'src/calling/calling-route';
import { releaseLead } from 'src/calling/claim-next-lead';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const handler = (event: RoutePayload, context?: LogicFunctionExecutionContext) =>
  runCallingRoute(event, context, async ({ client, actor, body }) => {
    const companyId = readRecordId(body, 'companyId');

    if (companyId !== null) {
      await releaseLead({ client, companyId, workspaceMemberId: actor.workspaceMemberId });
    }

    return EMPTY_RESPONSE;
  });

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.callingRelease.universalIdentifier,
  name: 'calling-release',
  description: 'Lets other salespeople call a lead this salesperson skipped.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.callingRelease.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
