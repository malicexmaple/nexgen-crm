import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  type CallingLead,
  createLeadCall,
  findLeadCallByRequestId,
} from 'src/calling/calling-records';

const MAX_ATTEMPTS = 3;

// The lead row is updated first and carries a snapshot of the call, so a Call
// record that failed to save is rebuilt on the next try instead of being lost.
export const ensureLastCallRecorded = async ({
  client,
  lead,
}: {
  client: CoreApiClient;
  lead: Pick<CallingLead, 'id' | 'lastCallRequestId' | 'lastCallSnapshot'>;
}): Promise<string | null> => {
  const snapshot = lead.lastCallSnapshot;

  if (snapshot === null || snapshot.requestId !== lead.lastCallRequestId) {
    return null;
  }

  for (let attempt = 1; ; attempt++) {
    const existing = await findLeadCallByRequestId({ client, requestId: snapshot.requestId });

    if (existing !== null) {
      return existing.id;
    }

    try {
      return await createLeadCall({ client, companyId: lead.id, snapshot });
    } catch (error) {
      // A parallel retry of the same click may have saved it first; requestId is unique.
      if (attempt >= MAX_ATTEMPTS) {
        console.error(
          `Could not save the Call record for request ${snapshot.requestId}:`,
          error instanceof Error ? error.message : error,
        );
        throw error;
      }
    }
  }
};
