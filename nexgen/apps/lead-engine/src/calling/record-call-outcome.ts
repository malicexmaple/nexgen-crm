import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type CallingActor } from 'src/calling/calling-actor';
import {
  type CallingLead,
  compareAndSetLead,
  isClaimableBy,
  isClaimedByOther,
  type LastCallSnapshot,
  matchesCallingState,
  pickCallingState,
  readCallingLead,
} from 'src/calling/calling-records';
import { applyCallOutcome, getOutcomeRejection } from 'src/calling/calling-rules';
import { ensureLastCallRecorded } from 'src/calling/ensure-last-call-recorded';
import { type CallOutcome } from 'src/constants/select-options';

export type CallingActionResult = {
  status: 'ok' | 'rejected';
  message: string | null;
  lead: CallingLead | null;
  callId: string | null;
};

const rejected = (message: string, lead: CallingLead | null): CallingActionResult => ({
  status: 'rejected',
  message,
  lead,
  callId: null,
});

export const CHANGED_BY_SOMEONE_ELSE = 'Someone else just updated this lead. Showing the latest.';

export const finishAlreadySavedAction = async ({
  client,
  lead,
}: {
  client: CoreApiClient;
  lead: CallingLead;
}): Promise<CallingActionResult> => ({
  status: 'ok',
  message: null,
  lead,
  callId: await ensureLastCallRecorded({ client, lead }),
});

export const recordCallOutcome = async ({
  client,
  actor,
  companyId,
  outcome,
  expectedAttempt,
  expectedCycle,
  requestId,
  note,
  now,
  timeZone,
}: {
  client: CoreApiClient;
  actor: CallingActor;
  companyId: string;
  outcome: CallOutcome;
  expectedAttempt: number;
  expectedCycle: number;
  requestId: string;
  note: string | null;
  now: Date;
  timeZone: string;
}): Promise<CallingActionResult> => {
  const lead = await readCallingLead({ client, companyId });

  if (lead === null) {
    return rejected('This lead no longer exists.', null);
  }

  if (lead.lastCallRequestId === requestId) {
    return finishAlreadySavedAction({ client, lead });
  }

  const rejection = getOutcomeRejection({ state: lead, expectedAttempt, expectedCycle });

  if (rejection !== null) {
    return rejected(rejection, lead);
  }

  if (isClaimedByOther(lead, actor.workspaceMemberId, now)) {
    return rejected('Another salesperson has this lead open right now.', lead);
  }

  const previousState = pickCallingState(lead);
  const { nextState, entry } = applyCallOutcome({
    state: previousState,
    outcome,
    calledAt: now,
    calledById: actor.workspaceMemberId,
    requestId,
    note,
    timeZone,
  });
  const snapshot: LastCallSnapshot = {
    requestId,
    calledById: actor.workspaceMemberId,
    calledAt: now.toISOString(),
    note,
    entry,
    previousState,
  };
  const changes = {
    ...nextState,
    lastCallSnapshot: snapshot,
    callClaimedById: null,
    callClaimedUntil: null,
  };
  const applied = await compareAndSetLead({
    client,
    companyId,
    conditions: [...matchesCallingState(previousState), isClaimableBy(actor.workspaceMemberId, now)],
    data: changes,
  });

  if (!applied) {
    const latest = await readCallingLead({ client, companyId });

    return latest?.lastCallRequestId === requestId
      ? finishAlreadySavedAction({ client, lead: latest })
      : rejected(CHANGED_BY_SOMEONE_ELSE, latest);
  }

  return finishAlreadySavedAction({ client, lead: { ...lead, ...changes } });
};
