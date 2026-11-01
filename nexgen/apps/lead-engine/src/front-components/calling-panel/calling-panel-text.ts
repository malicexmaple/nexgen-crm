import { type LeadCard, type SavedCall } from 'src/calling/calling-api-types';
import {
  type CallingStatus,
  LEAD_STATUS_OPTIONS,
  type LeadStatus,
} from 'src/constants/select-options';

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const formatTime = (value: string, now: Date = new Date()): string => {
  const date = new Date(value);
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  if (isSameDay(date, now)) {
    return time;
  }

  const day = date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
  });

  return `${day}, ${time}`;
};

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const describeSavedCall = (savedCall: SavedCall, now: Date = new Date()): string => {
  const { leadName, outcome, newStatus, nextCallAt, callAttempt } = savedCall;

  switch (outcome) {
    case 'ANSWERED':
      return `Answered on call ${callAttempt}. ${leadName} moved to Spoken to.`;
    case 'NO_ANSWER':
      return newStatus === 'SNOOZED' && nextCallAt !== null
        ? `No answer on call ${callAttempt}. ${leadName} comes back as CALL ${callAttempt + 1} at ${formatTime(nextCallAt, now)}.`
        : `No answer on call ${callAttempt}. ${leadName} moved to Nurture${nextCallAt !== null ? ` until ${formatDate(nextCallAt)}` : ''}.`;
    case 'NURTURE':
      return `${leadName} moved to Nurture${nextCallAt !== null ? ` until ${formatDate(nextCallAt)}` : ''}, then back as CALL 1.`;
    case 'DNQ':
      return `${leadName} marked DNQ. It will not come back to the calling list.`;
    case 'REACTIVATED':
      return `${leadName} is back in Ready to call as CALL 1.`;
  }
};

const STATUS_LABELS: Record<CallingStatus, string> = {
  READY: 'Ready to call',
  SNOOZED: 'Snoozed',
  NURTURE: 'Nurture',
  SPOKEN_TO: 'Spoken to',
  DISQUALIFIED: 'DNQ',
};

export const describeLeadStatus = (lead: LeadCard, now: Date = new Date()): string => {
  switch (lead.callingStatus) {
    case 'READY':
      return lead.claimedByName !== null
        ? `${lead.claimedByName} has this lead open right now.`
        : 'Ready to call now.';
    case 'SNOOZED':
      return lead.nextCallAt !== null
        ? `Snoozed. Back as CALL ${lead.callAttempt} at ${formatTime(lead.nextCallAt, now)}.`
        : `Snoozed. Back as CALL ${lead.callAttempt} soon.`;
    case 'NURTURE':
      return lead.nextCallAt !== null
        ? `In Nurture until ${formatDate(lead.nextCallAt)}, then back as CALL 1.`
        : 'In Nurture.';
    case 'SPOKEN_TO':
      return lead.answeredAt !== null
        ? `Answered on call ${lead.callAttempt}, ${formatTime(lead.answeredAt, now)}. Now in Spoken to.`
        : 'Spoken to.';
    case 'DISQUALIFIED':
      return `DNQ${lead.dnqReason !== null ? `: ${lead.dnqReason}` : ''}. This lead will not come back on its own.`;
  }
};

export const getStatusLabel = (status: CallingStatus): string => STATUS_LABELS[status];

export const getLeadStatusLabel = (status: LeadStatus): string =>
  LEAD_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;

// Google gives business types as identifiers such as "general_contractor".
export const formatBusinessType = (businessType: string): string => {
  const words = businessType.replace(/_/g, ' ').trim();

  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const formatPrice = ({ amount, currencyCode }: { amount: number; currencyCode: string }) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currencyCode} ${Math.round(amount)}`;
  }
};
