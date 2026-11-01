import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  type CallingLead,
  compareAndSetLead,
  findOwnClaimedLead,
  isClaimableBy,
  isClaimedByOther,
  listPoolCandidates,
  readCallingLead,
} from 'src/calling/calling-records';
import { CALL_CLAIM_MINUTES } from 'src/calling/calling-rules';

const CANDIDATES_PER_TRY = 10;

const buildClaim = (workspaceMemberId: string, now: Date) => ({
  callClaimedById: workspaceMemberId,
  callClaimedUntil: new Date(now.getTime() + CALL_CLAIM_MINUTES * 60 * 1000).toISOString(),
});

const claimIfReady = ({
  client,
  companyId,
  workspaceMemberId,
  now,
}: {
  client: CoreApiClient;
  companyId: string;
  workspaceMemberId: string;
  now: Date;
}) =>
  compareAndSetLead({
    client,
    companyId,
    conditions: [{ callingStatus: { eq: 'READY' } }, isClaimableBy(workspaceMemberId, now)],
    data: buildClaim(workspaceMemberId, now),
  });

// Opening a Ready lead holds it for this salesperson, so anyone else who opens
// it sees who is calling and cannot record a call over them.
export const claimLead = async ({
  client,
  lead,
  workspaceMemberId,
  now,
}: {
  client: CoreApiClient;
  lead: CallingLead;
  workspaceMemberId: string | null;
  now: Date;
}): Promise<CallingLead> => {
  if (
    workspaceMemberId === null ||
    lead.callingStatus !== 'READY' ||
    isClaimedByOther(lead, workspaceMemberId, now)
  ) {
    return lead;
  }

  if (await claimIfReady({ client, companyId: lead.id, workspaceMemberId, now })) {
    return { ...lead, ...buildClaim(workspaceMemberId, now) };
  }

  return (await readCallingLead({ client, companyId: lead.id })) ?? lead;
};

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
    if (await claimIfReady({ client, companyId: candidate.id, workspaceMemberId, now })) {
      return { ...candidate, ...buildClaim(workspaceMemberId, now) };
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
