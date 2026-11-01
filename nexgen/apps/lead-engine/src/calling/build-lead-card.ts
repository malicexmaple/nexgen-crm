import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type CallingActor } from 'src/calling/calling-actor';
import { type LeadCard } from 'src/calling/calling-api-types';
import {
  type CallingLead,
  isClaimedByOther,
  type LeadCallRecord,
  listRecentLeadCalls,
  readWorkspaceMembers,
} from 'src/calling/calling-records';
import { REACTIVATABLE_STATUSES, UNDO_WINDOW_MINUTES } from 'src/calling/calling-rules';
import { isNonEmptyString } from 'src/logic-functions/utils/guards';

const RECENT_CALL_COUNT = 6;

export const canUndoCall = ({
  call,
  actor,
  now,
}: {
  call: Pick<LeadCallRecord, 'calledById' | 'calledAt' | 'undoneAt'>;
  actor: CallingActor;
  now: Date;
}): boolean => {
  if (call.undoneAt !== null) {
    return false;
  }

  if (actor.isCallingAdmin) {
    return true;
  }

  return (
    actor.workspaceMemberId !== null &&
    call.calledById === actor.workspaceMemberId &&
    call.calledAt !== null &&
    now.getTime() - new Date(call.calledAt).getTime() <= UNDO_WINDOW_MINUTES * 60 * 1000
  );
};

const formatPhone = (phone: CallingLead['phone']) => {
  const number = phone?.primaryPhoneNumber?.trim() ?? '';

  if (number.length === 0) {
    return { phoneNumber: null, phoneHref: null };
  }

  const phoneNumber = number.startsWith('+')
    ? number
    : `${phone?.primaryPhoneCallingCode ?? ''} ${number}`.trim();

  return { phoneNumber, phoneHref: `tel:${phoneNumber.replace(/[^\d+]/g, '')}` };
};

export const buildLeadCard = async ({
  client,
  lead,
  actor,
  now,
}: {
  client: CoreApiClient;
  lead: CallingLead;
  actor: CallingActor;
  now: Date;
}): Promise<LeadCard> => {
  const recentCalls = await listRecentLeadCalls({
    client,
    companyId: lead.id,
    first: RECENT_CALL_COUNT,
  });
  const claimedByOther = isClaimedByOther(lead, actor.workspaceMemberId, now);
  const members = await readWorkspaceMembers({
    client,
    workspaceMemberIds: [
      ...recentCalls.map((call) => call.calledById),
      claimedByOther ? lead.callClaimedById : null,
    ].filter(isNonEmptyString),
  });
  const latestCall =
    recentCalls.find(
      (call) => call.requestId === lead.lastCallRequestId && call.undoneAt === null,
    ) ?? null;

  return {
    id: lead.id,
    name: lead.name ?? 'Unnamed business',
    contactName: lead.contactName,
    ...formatPhone(lead.phone),
    callingStatus: lead.callingStatus,
    callAttempt: lead.callAttempt,
    callingCycle: lead.callingCycle,
    totalCallAttempts: lead.totalCallAttempts,
    lastCallAt: lead.lastCallAt,
    lastCallOutcome: lead.lastCallOutcome,
    nextCallAt: lead.nextCallAt,
    answeredAt: lead.answeredAt,
    dnqReason: lead.dnqReason || null,
    nurtureReason: lead.nurtureReason || null,
    callOpener: lead.callOpener || null,
    pitchSiteUrl: lead.pitchSiteUrl?.primaryLinkUrl || null,
    claimedByName:
      claimedByOther && lead.callClaimedById !== null
        ? (members.get(lead.callClaimedById)?.name ?? 'Another salesperson')
        : null,
    canRecordOutcome: lead.callingStatus === 'READY' && !claimedByOther,
    undoableCallId:
      latestCall !== null && canUndoCall({ call: latestCall, actor, now })
        ? latestCall.id
        : null,
    canReactivate:
      actor.isCallingAdmin && REACTIVATABLE_STATUSES.includes(lead.callingStatus),
    recentCalls: recentCalls.map((call) => ({
      id: call.id,
      name: call.name ?? 'Call',
      outcome: call.outcome,
      calledAt: call.calledAt,
      calledByName:
        call.calledById !== null ? (members.get(call.calledById)?.name ?? null) : null,
      note: call.note || null,
      isUndone: call.undoneAt !== null,
    })),
  };
};
