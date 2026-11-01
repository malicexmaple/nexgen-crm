import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import {
  readRecordId,
  rejectedResponse,
  runCallingRoute,
  toCallingResponse,
} from 'src/calling/calling-route';
import { reactivateLead } from 'src/calling/reactivate-lead';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const handler = (event: RoutePayload, context?: LogicFunctionExecutionContext) =>
  runCallingRoute(event, context, async ({ client, actor, body, now }) => {
    const companyId = readRecordId(body, 'companyId');
    const requestId = readRecordId(body, 'requestId');

    if (companyId === null || requestId === null) {
      return rejectedResponse('That button press was not understood. Refresh and try again.');
    }

    const result = await reactivateLead({ client, actor, companyId, requestId, now });

    return toCallingResponse({ client, actor, result, now });
  });

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.callingReactivate.universalIdentifier,
  name: 'calling-reactivate',
  description:
    'Lets a calling admin move a Spoken to, Nurture or DNQ lead back to Ready to call as call 1.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.callingReactivate.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
