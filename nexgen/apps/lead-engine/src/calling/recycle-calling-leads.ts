import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  compareAndSetLead,
  listDueLeads,
  matchesCallingState,
  pickCallingState,
  returnSnoozedLeads,
} from 'src/calling/calling-records';
import { getNurtureReturnState } from 'src/calling/calling-rules';

const BATCH_SIZE = 100;

// Safe to run any number of times: each update re-checks that the lead is still
// due and in the same state, so a lead is never returned twice. DNQ and Spoken to
// leads are never selected.
export const recycleCallingLeads = async ({
  client,
  now,
}: {
  client: CoreApiClient;
  now: Date;
}): Promise<{ snoozedReturned: number; nurtureReturned: number }> => {
  let snoozedReturned = 0;
  let nurtureReturned = 0;

  for (;;) {
    const due = await listDueLeads({ client, callingStatus: 'SNOOZED', now, first: BATCH_SIZE });

    if (due.length === 0) {
      break;
    }

    const returned = await returnSnoozedLeads({
      client,
      companyIds: due.map((lead) => lead.id),
      now,
    });

    snoozedReturned += returned;

    if (due.length < BATCH_SIZE || returned === 0) {
      break;
    }
  }

  for (;;) {
    const due = await listDueLeads({ client, callingStatus: 'NURTURE', now, first: BATCH_SIZE });
    let returnedInBatch = 0;

    for (const lead of due) {
      const state = pickCallingState(lead);
      const returned = await compareAndSetLead({
        client,
        companyId: lead.id,
        conditions: [...matchesCallingState(state), { nextCallAt: { lte: now.toISOString() } }],
        data: getNurtureReturnState(state),
      });

      returnedInBatch += returned ? 1 : 0;
    }

    nurtureReturned += returnedInBatch;

    if (due.length < BATCH_SIZE || returnedInBatch === 0) {
      break;
    }
  }

  return { snoozedReturned, nurtureReturned };
};
