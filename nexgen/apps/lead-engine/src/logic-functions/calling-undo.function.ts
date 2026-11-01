import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import {
  readRecordId,
  rejectedResponse,
  runCallingRoute,
  toCallingResponse,
} from 'src/calling/calling-route';
import { undoLeadCall } from 'src/calling/undo-lead-call';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const handler = (event: RoutePayload, context?: LogicFunctionExecutionContext) =>
  runCallingRoute(event, context, async ({ client, actor, body, now }) => {
    const callId = readRecordId(body, 'callId');

    if (callId === null) {
      return rejectedResponse('That call could not be found.');
    }

    const result = await undoLeadCall({ client, actor, callId, now });

    return toCallingResponse({ client, actor, result, now });
  });

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.callingUndo.universalIdentifier,
  name: 'calling-undo',
  description: 'Undoes the latest call on a lead and puts it back exactly as it was.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.callingUndo.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
