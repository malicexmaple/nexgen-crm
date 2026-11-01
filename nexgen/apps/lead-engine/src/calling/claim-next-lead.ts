import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  type CallingLead,
  compareAndSetLead,
  findOwnClaimedLead,
  isClaimableBy,
  listPoolCandidates,
} from 'src/calling/calling-records';
import { CALL_CLAIM_MINUTES } from 'src/calling/calling-rules';

const CANDIDATES_PER_TRY = 10;

// Holds the lead for this salesperson for a few minutes so nobody else's
// calling screen shows it at the same time.
export const claimNextLead = async ({
  client,
  workspaceMemberId,
  skipCompanyIds,
  now,
}: {
  client: CoreApiClient;
  workspaceMemberId: string | null;
  skipCompanyIds: string[];
  now: Date;
}): Promise<CallingLead | null> => {
  if (workspaceMemberId === null) {
    const [candidate] = await listPoolCandidates({
      client,
      now,
      workspaceMemberId,
      excludeCompanyIds: skipCompanyIds,
      first: 1,
    });

    return candidate ?? null;
  }

  const claim = {
    callClaimedById: workspaceMemberId,
    callClaimedUntil: new Date(now.getTime() + CALL_CLAIM_MINUTES * 60 * 1000).toISOString(),
  };
  const ownLead = await findOwnClaimedLead({
    client,
    now,
    workspaceMemberId,
    excludeCompanyIds: skipCompanyIds,
  });
  const candidates =
    ownLead !== null
      ? [ownLead]
      : await listPoolCandidates({
          client,
          now,
          workspaceMemberId,
          excludeCompanyIds: skipCompanyIds,
          first: CANDIDATES_PER_TRY,
        });

  for (const candidate of candidates) {
    const claimed = await compareAndSetLead({
      client,
      companyId: candidate.id,
      conditions: [{ callingStatus: { eq: 'READY' } }, isClaimableBy(workspaceMemberId, now)],
      data: claim,
    });

    if (claimed) {
      return { ...candidate, ...claim };
    }
  }

  return null;
};

export const releaseLead = async ({
  client,
  companyId,
  workspaceMemberId,
}: {
  client: CoreApiClient;
  companyId: string;
  workspaceMemberId: string | null;
}): Promise<void> => {
  if (workspaceMemberId === null) {
    return;
  }

  await compareAndSetLead({
    client,
    companyId,
    conditions: [{ callClaimedById: { eq: workspaceMemberId } }],
    data: { callClaimedById: null, callClaimedUntil: null },
  });
};
