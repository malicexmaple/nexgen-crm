import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type CallingActor } from 'src/calling/calling-actor';
import {
  compareAndSetLead,
  type LastCallSnapshot,
  matchesCallingState,
  pickCallingState,
  readCallingLead,
} from 'src/calling/calling-records';
import { applyReactivation, REACTIVATABLE_STATUSES } from 'src/calling/calling-rules';
import {
  type CallingActionResult,
  CHANGED_BY_SOMEONE_ELSE,
  finishAlreadySavedAction,
} from 'src/calling/record-call-outcome';

export const reactivateLead = async ({
  client,
  actor,
  companyId,
  requestId,
  now,
}: {
  client: CoreApiClient;
  actor: CallingActor;
  companyId: string;
  requestId: string;
  now: Date;
}): Promise<CallingActionResult> => {
  const lead = await readCallingLead({ client, companyId });

  if (lead === null) {
    return { status: 'rejected', message: 'This lead no longer exists.', lead: null, callId: null };
  }

  if (lead.lastCallRequestId === requestId) {
    return finishAlreadySavedAction({ client, lead });
  }

  if (!actor.isCallingAdmin) {
    return {
      status: 'rejected',
      message: 'Only a calling admin can move a lead back to Ready to call.',
      lead,
      callId: null,
    };
  }

  if (!REACTIVATABLE_STATUSES.includes(lead.callingStatus)) {
    return {
      status: 'rejected',
      message: 'Only Spoken to, Nurture or DNQ leads can be moved back to Ready to call.',
      lead,
      callId: null,
    };
  }

  const previousState = pickCallingState(lead);
  const { nextState, entry } = applyReactivation({ state: previousState, requestId });
  const snapshot: LastCallSnapshot = {
    requestId,
    calledById: actor.workspaceMemberId,
    calledAt: now.toISOString(),
    note: `Moved back by ${actor.name}`,
    entry,
    previousState,
  };
  const changes = { ...nextState, lastCallSnapshot: snapshot };
  const applied = await compareAndSetLead({
    client,
    companyId,
    conditions: matchesCallingState(previousState),
    data: changes,
  });

  if (!applied) {
    const latest = await readCallingLead({ client, companyId });

    return latest?.lastCallRequestId === requestId
      ? finishAlreadySavedAction({ client, lead: latest })
      : { status: 'rejected', message: CHANGED_BY_SOMEONE_ELSE, lead: latest, callId: null };
  }

  return finishAlreadySavedAction({ client, lead: { ...lead, ...changes } });
};
