import { type CoreApiClient } from 'twenty-client-sdk/core';

import { canUndoCall } from 'src/calling/build-lead-card';
import { type CallingActor } from 'src/calling/calling-actor';
import {
  compareAndSetLead,
  markLeadCallUndone,
  readCallingLead,
  readLeadCall,
} from 'src/calling/calling-records';
import { UNDO_WINDOW_MINUTES } from 'src/calling/calling-rules';
import {
  type CallingActionResult,
  CHANGED_BY_SOMEONE_ELSE,
} from 'src/calling/record-call-outcome';

const MAX_ATTEMPTS = 3;

const rejected = (
  message: string,
  lead: CallingActionResult['lead'] = null,
): CallingActionResult => ({ status: 'rejected', message, lead, callId: null });

export const undoLeadCall = async ({
  client,
  actor,
  callId,
  now,
}: {
  client: CoreApiClient;
  actor: CallingActor;
  callId: string;
  now: Date;
}): Promise<CallingActionResult> => {
  const call = await readLeadCall({ client, callId });

  if (call === null || call.companyId === null || call.requestId === null) {
    return rejected('That call could not be found.');
  }

  const lead = await readCallingLead({ client, companyId: call.companyId });

  if (call.undoneAt !== null) {
    return { status: 'ok', message: 'This call was already undone.', lead, callId };
  }

  if (!canUndoCall({ call, actor, now })) {
    return rejected(
      `You can undo your own call for ${UNDO_WINDOW_MINUTES} minutes. After that, ask a calling admin.`,
      lead,
    );
  }

  if (lead === null || call.previousState === null) {
    return rejected('This call cannot be undone.', lead);
  }

  if (lead.lastCallRequestId !== call.requestId) {
    return rejected('Only the latest call on a lead can be undone.', lead);
  }

  const restored = { ...call.previousState, lastCallSnapshot: null };
  const applied = await compareAndSetLead({
    client,
    companyId: lead.id,
    conditions: [{ lastCallRequestId: { eq: call.requestId } }],
    data: restored,
  });

  if (!applied) {
    return rejected(CHANGED_BY_SOMEONE_ELSE, await readCallingLead({ client, companyId: lead.id }));
  }

  for (let attempt = 1; ; attempt++) {
    try {
      await markLeadCallUndone({ client, callId, undoneAt: now, undoneBy: actor.name });
      break;
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        console.error(
          `Lead ${lead.id} was restored but call ${callId} could not be marked undone:`,
          error instanceof Error ? error.message : error,
        );
        break;
      }
    }
  }

  return { status: 'ok', message: null, lead: { ...lead, ...restored }, callId };
};
