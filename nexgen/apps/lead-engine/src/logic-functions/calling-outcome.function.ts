import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import {
  getCallingTimeZone,
  readNote,
  readRecordId,
  rejectedResponse,
  runCallingRoute,
  toCallingResponse,
} from 'src/calling/calling-route';
import { isCallOutcome } from 'src/calling/calling-rules';
import { recordCallOutcome } from 'src/calling/record-call-outcome';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const handler = (event: RoutePayload, context?: LogicFunctionExecutionContext) =>
  runCallingRoute(event, context, async ({ client, actor, body, now }) => {
    const companyId = readRecordId(body, 'companyId');
    const requestId = readRecordId(body, 'requestId');
    const { outcome, expectedAttempt, expectedCycle } = body;

    if (
      companyId === null ||
      requestId === null ||
      !isCallOutcome(outcome) ||
      typeof expectedAttempt !== 'number' ||
      typeof expectedCycle !== 'number'
    ) {
      return rejectedResponse('That button press was not understood. Refresh and try again.');
    }

    const result = await recordCallOutcome({
      client,
      actor,
      companyId,
      outcome,
      expectedAttempt,
      expectedCycle,
      requestId,
      note: readNote(body),
      now,
      timeZone: getCallingTimeZone(),
    });

    return toCallingResponse({ client, actor, result, now });
  });

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.callingOutcome.universalIdentifier,
  name: 'calling-outcome',
  description:
    'Records Answered, No answer, Nurture or DNQ on a lead and moves it on in the calling pipeline.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.callingOutcome.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
