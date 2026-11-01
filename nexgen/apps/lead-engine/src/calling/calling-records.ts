import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  buildCallEntryName,
  type CallEntry,
  type LeadCallingState,
} from 'src/calling/calling-rules';
import {
  type CallHistoryOutcome,
  type CallingStatus,
  type LeadStatus,
} from 'src/constants/select-options';
import { isPlainObject } from 'src/logic-functions/utils/guards';

export type LastCallSnapshot = {
  requestId: string;
  calledById: string | null;
  calledAt: string;
  note: string | null;
  entry: CallEntry;
  previousState: LeadCallingState;
};

export type CallingLead = LeadCallingState & {
  id: string;
  name: string | null;
  contactName: string | null;
  phone: { primaryPhoneNumber: string | null; primaryPhoneCallingCode: string | null } | null;
  callOpener: string | null;
  pitchSiteUrl: { primaryLinkUrl: string | null } | null;
  callClaimedById: string | null;
  callClaimedUntil: string | null;
  lastCallSnapshot: LastCallSnapshot | null;
};

export type LeadCallRecord = {
  id: string;
  name: string | null;
  companyId: string | null;
  calledById: string | null;
  calledAt: string | null;
  outcome: CallHistoryOutcome | null;
  requestId: string | null;
  note: string | null;
  undoneAt: string | null;
  previousState: LeadCallingState | null;
};

// Leads the team has closed either way stay out of the calling pool.
const POOL_LEAD_STATUSES: LeadStatus[] = ['NEW', 'AUDITED', 'PITCH_READY', 'CALLED', 'FOLLOW_UP'];

const CALLING_STATE_SELECTION: Record<keyof LeadCallingState, true> = {
  callingStatus: true,
  callAttempt: true,
  callingCycle: true,
  totalCallAttempts: true,
  lastCallAt: true,
  lastCallOutcome: true,
  nextCallAt: true,
  answeredAt: true,
  lastCalledById: true,
  dnqAt: true,
  dnqReason: true,
  nurtureReason: true,
  leadStatus: true,
  lastCallRequestId: true,
};

const CALLING_LEAD_SELECTION = {
  id: true,
  name: true,
  phone: { primaryPhoneNumber: true, primaryPhoneCallingCode: true },
  callOpener: true,
  pitchSiteUrl: { primaryLinkUrl: true },
  callClaimedById: true,
  callClaimedUntil: true,
  lastCallSnapshot: true,
  people: {
    __args: { first: 1, orderBy: [{ createdAt: 'AscNullsFirst' }] },
    edges: { node: { name: { firstName: true, lastName: true } } },
  },
  ...CALLING_STATE_SELECTION,
};

const LEAD_CALL_SELECTION = {
  id: true,
  name: true,
  companyId: true,
  calledById: true,
  calledAt: true,
  outcome: true,
  requestId: true,
  note: true,
  undoneAt: true,
  previousState: true,
};

type FullName = { firstName: string | null; lastName: string | null } | null;

type CallingLeadNode = Omit<CallingLead, 'contactName' | 'lastCallSnapshot'> & {
  lastCallSnapshot: unknown;
  people?: { edges?: { node: { name: FullName } }[] };
};

export const formatFullName = (name: FullName): string | null => {
  const fullName = [name?.firstName, name?.lastName].filter(Boolean).join(' ').trim();

  return fullName.length > 0 ? fullName : null;
};

export const pickCallingState = (record: LeadCallingState): LeadCallingState =>
  Object.fromEntries(
    Object.keys(CALLING_STATE_SELECTION).map((key) => [
      key,
      record[key as keyof LeadCallingState] ?? null,
    ]),
  ) as LeadCallingState;

const isCallingState = (value: unknown): value is LeadCallingState =>
  isPlainObject(value) &&
  typeof value.callingStatus === 'string' &&
  typeof value.callAttempt === 'number' &&
  typeof value.callingCycle === 'number';

const parseSnapshot = (value: unknown): LastCallSnapshot | null =>
  isPlainObject(value) &&
  typeof value.requestId === 'string' &&
  isPlainObject(value.entry) &&
  isCallingState(value.previousState)
    ? (value as LastCallSnapshot)
    : null;

const toCallingLead = (node: CallingLeadNode): CallingLead => {
  const { people, lastCallSnapshot, ...lead } = node;

  return {
    ...lead,
    contactName: formatFullName(people?.edges?.[0]?.node.name ?? null),
    lastCallSnapshot: parseSnapshot(lastCallSnapshot),
  };
};

const queryCallingLeads = async ({
  client,
  filter,
  orderBy,
  first,
}: {
  client: CoreApiClient;
  filter: Record<string, unknown>;
  orderBy?: Record<string, string>[];
  first: number;
}): Promise<CallingLead[]> => {
  const result = (await client.query({
    companies: {
      __args: { filter, first, ...(orderBy ? { orderBy } : {}) },
      edges: { node: CALLING_LEAD_SELECTION },
    },
  } as never)) as { companies?: { edges?: { node: CallingLeadNode }[] } };

  return (result.companies?.edges ?? []).map((edge) => toCallingLead(edge.node));
};

export const readCallingLead = async ({
  client,
  companyId,
}: {
  client: CoreApiClient;
  companyId: string;
}): Promise<CallingLead | null> =>
  (await queryCallingLeads({ client, filter: { id: { eq: companyId } }, first: 1 }))[0] ??
  null;

// Every write that moves a lead goes through here: the update only lands if the
// row still matches the conditions, checked by Postgres in the same UPDATE.
export const compareAndSetLead = async ({
  client,
  companyId,
  conditions,
  data,
}: {
  client: CoreApiClient;
  companyId: string;
  conditions: Record<string, unknown>[];
  data: Record<string, unknown>;
}): Promise<boolean> => {
  const result = (await client.mutation({
    updateCompanies: {
      __args: { filter: { and: [{ id: { eq: companyId } }, ...conditions] }, data },
      id: true,
    },
  } as never)) as { updateCompanies?: { id: string }[] };

  return (result.updateCompanies?.length ?? 0) > 0;
};

export const matchesCallingState = (state: LeadCallingState): Record<string, unknown>[] => [
  { callingStatus: { eq: state.callingStatus } },
  { callAttempt: { eq: state.callAttempt } },
  { callingCycle: { eq: state.callingCycle } },
  {
    lastCallRequestId:
      state.lastCallRequestId === null ? { is: 'NULL' } : { eq: state.lastCallRequestId },
  },
];

export const isClaimableBy = (
  workspaceMemberId: string | null,
  now: Date,
): Record<string, unknown> => ({
  or: [
    { callClaimedUntil: { is: 'NULL' } },
    { callClaimedUntil: { lt: now.toISOString() } },
    ...(workspaceMemberId !== null ? [{ callClaimedById: { eq: workspaceMemberId } }] : []),
  ],
});

export const isClaimedByOther = (
  lead: Pick<CallingLead, 'callClaimedById' | 'callClaimedUntil'>,
  workspaceMemberId: string | null,
  now: Date,
): boolean =>
  lead.callClaimedById !== null &&
  lead.callClaimedById !== workspaceMemberId &&
  lead.callClaimedUntil !== null &&
  new Date(lead.callClaimedUntil).getTime() > now.getTime();

export const listPoolCandidates = async ({
  client,
  now,
  workspaceMemberId,
  excludeCompanyIds,
  first,
}: {
  client: CoreApiClient;
  now: Date;
  workspaceMemberId: string | null;
  excludeCompanyIds: string[];
  first: number;
}): Promise<CallingLead[]> =>
  queryCallingLeads({
    client,
    first,
    filter: {
      and: [
        { callingStatus: { eq: 'READY' } },
        { phone: { primaryPhoneNumber: { neq: '' } } },
        { or: [{ leadStatus: { is: 'NULL' } }, { leadStatus: { in: POOL_LEAD_STATUSES } }] },
        isClaimableBy(workspaceMemberId, now),
        ...(excludeCompanyIds.length > 0
          ? [{ not: { id: { in: excludeCompanyIds } } }]
          : []),
      ],
    },
    orderBy: [
      { leadPriority: 'DescNullsLast' },
      { lastCallAt: 'AscNullsFirst' },
      { createdAt: 'AscNullsFirst' },
    ],
  });

export const findOwnClaimedLead = async ({
  client,
  now,
  workspaceMemberId,
  excludeCompanyIds,
}: {
  client: CoreApiClient;
  now: Date;
  workspaceMemberId: string;
  excludeCompanyIds: string[];
}): Promise<CallingLead | null> =>
  (
    await queryCallingLeads({
      client,
      first: 1,
      filter: {
        and: [
          { callingStatus: { eq: 'READY' } },
          { callClaimedById: { eq: workspaceMemberId } },
          { callClaimedUntil: { gt: now.toISOString() } },
          ...(excludeCompanyIds.length > 0
            ? [{ not: { id: { in: excludeCompanyIds } } }]
            : []),
        ],
      },
    })
  )[0] ?? null;

export const findNextDueAt = async ({
  client,
}: {
  client: CoreApiClient;
}): Promise<string | null> =>
  (
    await queryCallingLeads({
      client,
      first: 1,
      filter: { callingStatus: { eq: 'SNOOZED' } },
      orderBy: [{ nextCallAt: 'AscNullsLast' }],
    })
  )[0]?.nextCallAt ?? null;

export const listDueLeads = async ({
  client,
  callingStatus,
  now,
  first,
}: {
  client: CoreApiClient;
  callingStatus: Extract<CallingStatus, 'SNOOZED' | 'NURTURE'>;
  now: Date;
  first: number;
}): Promise<CallingLead[]> =>
  queryCallingLeads({
    client,
    first,
    filter: {
      and: [{ callingStatus: { eq: callingStatus } }, { nextCallAt: { lte: now.toISOString() } }],
    },
    orderBy: [{ nextCallAt: 'AscNullsLast' }],
  });

export const returnSnoozedLeads = async ({
  client,
  companyIds,
  now,
}: {
  client: CoreApiClient;
  companyIds: string[];
  now: Date;
}): Promise<number> => {
  const result = (await client.mutation({
    updateCompanies: {
      __args: {
        filter: {
          and: [
            { id: { in: companyIds } },
            { callingStatus: { eq: 'SNOOZED' } },
            { nextCallAt: { lte: now.toISOString() } },
          ],
        },
        data: { callingStatus: 'READY', nextCallAt: null },
      },
      id: true,
    },
  } as never)) as { updateCompanies?: { id: string }[] };

  return result.updateCompanies?.length ?? 0;
};

const toLeadCallRecord = (node: LeadCallRecord & { previousState: unknown }): LeadCallRecord => ({
  ...node,
  previousState: isCallingState(node.previousState) ? node.previousState : null,
});

const queryLeadCalls = async ({
  client,
  filter,
  first,
}: {
  client: CoreApiClient;
  filter: Record<string, unknown>;
  first: number;
}): Promise<LeadCallRecord[]> => {
  const result = (await client.query({
    leadCalls: {
      __args: { filter, first, orderBy: [{ calledAt: 'DescNullsLast' }] },
      edges: { node: LEAD_CALL_SELECTION },
    },
  } as never)) as { leadCalls?: { edges?: { node: LeadCallRecord }[] } };

  return (result.leadCalls?.edges ?? []).map((edge) => toLeadCallRecord(edge.node));
};

export const readLeadCall = async ({
  client,
  callId,
}: {
  client: CoreApiClient;
  callId: string;
}): Promise<LeadCallRecord | null> =>
  (await queryLeadCalls({ client, filter: { id: { eq: callId } }, first: 1 }))[0] ?? null;

export const findLeadCallByRequestId = async ({
  client,
  requestId,
}: {
  client: CoreApiClient;
  requestId: string;
}): Promise<LeadCallRecord | null> =>
  (await queryLeadCalls({ client, filter: { requestId: { eq: requestId } }, first: 1 }))[0] ??
  null;

export const listRecentLeadCalls = async ({
  client,
  companyId,
  first,
}: {
  client: CoreApiClient;
  companyId: string;
  first: number;
}): Promise<LeadCallRecord[]> =>
  queryLeadCalls({ client, filter: { companyId: { eq: companyId } }, first });

export const createLeadCall = async ({
  client,
  companyId,
  snapshot,
}: {
  client: CoreApiClient;
  companyId: string;
  snapshot: LastCallSnapshot;
}): Promise<string> => {
  const { entry } = snapshot;
  const result = (await client.mutation({
    createLeadCall: {
      __args: {
        data: {
          name: buildCallEntryName(entry),
          companyId,
          calledById: snapshot.calledById,
          calledAt: snapshot.calledAt,
          callAttempt: entry.callAttempt,
          callingCycle: entry.callingCycle,
          outcome: entry.outcome,
          previousStatus: entry.previousStatus,
          newStatus: entry.newStatus,
          nextCallAt: entry.nextCallAt,
          note: snapshot.note,
          requestId: snapshot.requestId,
          previousState: snapshot.previousState,
        },
      },
      id: true,
    },
  } as never)) as { createLeadCall?: { id: string } };

  if (!result.createLeadCall?.id) {
    throw new Error(`Twenty did not return an id for call ${snapshot.requestId}`);
  }

  return result.createLeadCall.id;
};

export const markLeadCallUndone = async ({
  client,
  callId,
  undoneAt,
  undoneBy,
}: {
  client: CoreApiClient;
  callId: string;
  undoneAt: Date;
  undoneBy: string;
}): Promise<void> => {
  await client.mutation({
    updateLeadCall: {
      __args: {
        id: callId,
        data: { undoneAt: undoneAt.toISOString(), undoneBy },
      },
      id: true,
    },
  } as never);
};

export type WorkspaceMember = {
  id: string;
  name: string | null;
  email: string | null;
};

export const readWorkspaceMembers = async ({
  client,
  workspaceMemberIds,
}: {
  client: CoreApiClient;
  workspaceMemberIds: string[];
}): Promise<Map<string, WorkspaceMember>> => {
  const ids = [...new Set(workspaceMemberIds)];

  if (ids.length === 0) {
    return new Map();
  }

  const result = (await client.query({
    workspaceMembers: {
      __args: { filter: { id: { in: ids } }, first: ids.length },
      edges: { node: { id: true, userEmail: true, name: { firstName: true, lastName: true } } },
    },
  } as never)) as {
    workspaceMembers?: {
      edges?: { node: { id: string; userEmail: string | null; name: FullName } }[];
    };
  };

  return new Map(
    (result.workspaceMembers?.edges ?? []).map(({ node }) => [
      node.id,
      { id: node.id, name: formatFullName(node.name) ?? node.userEmail, email: node.userEmail },
    ]),
  );
};
