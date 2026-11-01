import { CoreApiClient } from 'twenty-client-sdk/core';
import { type RoutePayload } from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import { buildLeadCard } from 'src/calling/build-lead-card';
import { type CallingActor, resolveCallingActor } from 'src/calling/calling-actor';
import { type CallingResponse } from 'src/calling/calling-api-types';
import { type CallingActionResult } from 'src/calling/record-call-outcome';
import { DEFAULT_CALLING_TIME_ZONE, SETTING_NAMES } from 'src/constants/settings';
import { isNonEmptyString, isPlainObject } from 'src/logic-functions/utils/guards';
import { getOptionalSetting } from 'src/logic-functions/utils/settings';
import { isCompanyId } from 'src/pitch-site/pitch-site-storage';

export type CallingRouteContext = {
  client: CoreApiClient;
  actor: CallingActor;
  body: Record<string, unknown>;
  now: Date;
};

export const EMPTY_RESPONSE: CallingResponse = {
  status: 'ok',
  message: null,
  lead: null,
  savedCall: null,
  nextDueAt: null,
};

export const rejectedResponse = (message: string): CallingResponse => ({
  ...EMPTY_RESPONSE,
  status: 'rejected',
  message,
});

export const isRecordId = isCompanyId;

export const readRecordId = (body: Record<string, unknown>, key: string): string | null => {
  const value = body[key];

  return isRecordId(value) ? value : null;
};

export const readNote = (body: Record<string, unknown>): string | null => {
  const note = body.note;

  return isNonEmptyString(note) ? note.trim().slice(0, 500) : null;
};

export const getCallingTimeZone = (): string => {
  const timeZone = getOptionalSetting(SETTING_NAMES.callingTimeZone);

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timeZone ?? undefined });

    return timeZone ?? DEFAULT_CALLING_TIME_ZONE;
  } catch {
    console.warn(`Calling time zone "${timeZone}" is not valid, using ${DEFAULT_CALLING_TIME_ZONE}.`);

    return DEFAULT_CALLING_TIME_ZONE;
  }
};

export const toCallingResponse = async ({
  client,
  actor,
  result,
  now,
}: {
  client: CoreApiClient;
  actor: CallingActor;
  result: CallingActionResult;
  now: Date;
}): Promise<CallingResponse> => {
  const lead = result.lead;
  const leadCard = lead !== null ? await buildLeadCard({ client, lead, actor, now }) : null;
  const entry = lead?.lastCallSnapshot?.entry ?? null;

  return {
    status: result.status,
    message: result.message,
    lead: leadCard,
    savedCall:
      result.status === 'ok' && entry !== null && lead !== null && result.callId !== null
        ? {
            callId: result.callId,
            outcome: entry.outcome,
            leadName: leadCard?.name ?? 'This lead',
            newStatus: entry.newStatus,
            nextCallAt: entry.nextCallAt,
            callAttempt: entry.callAttempt,
            canUndo: leadCard?.undoableCallId === result.callId,
          }
        : null,
    nextDueAt: null,
  };
};

// Runs as the app so it can write the calling fields no one else may edit,
// but the signed-in salesperson is still recorded from the route context.
export const runCallingRoute = async (
  event: RoutePayload,
  context: LogicFunctionExecutionContext | undefined,
  action: (routeContext: CallingRouteContext) => Promise<CallingResponse>,
): Promise<CallingResponse> => {
  try {
    const client = new CoreApiClient({ runAs: 'application' });
    const actor = await resolveCallingActor({
      client,
      workspaceMemberId: context?.workspaceMemberId ?? null,
    });

    return await action({
      client,
      actor,
      body: isPlainObject(event.body) ? event.body : {},
      now: new Date(),
    });
  } catch (error) {
    console.error(
      `Calling route ${event.requestContext?.http?.path ?? ''} failed:`,
      error instanceof Error ? error.message : error,
    );

    return rejectedResponse('That could not be saved. Check your connection and try again.');
  }
};
