import {
  type CallHistoryOutcome,
  type CallingStatus,
  type CallOutcome,
} from 'src/constants/select-options';

export type LeadCardCall = {
  id: string;
  name: string;
  outcome: CallHistoryOutcome | null;
  calledAt: string | null;
  calledByName: string | null;
  note: string | null;
  isUndone: boolean;
};

export type LeadCard = {
  id: string;
  name: string;
  contactName: string | null;
  phoneNumber: string | null;
  phoneHref: string | null;
  callingStatus: CallingStatus;
  callAttempt: number;
  callingCycle: number;
  totalCallAttempts: number;
  lastCallAt: string | null;
  lastCallOutcome: CallOutcome | null;
  nextCallAt: string | null;
  answeredAt: string | null;
  dnqReason: string | null;
  nurtureReason: string | null;
  callOpener: string | null;
  pitchSiteUrl: string | null;
  claimedByName: string | null;
  canRecordOutcome: boolean;
  undoableCallId: string | null;
  canReactivate: boolean;
  recentCalls: LeadCardCall[];
};

export type SavedCall = {
  callId: string | null;
  outcome: CallHistoryOutcome;
  leadName: string;
  newStatus: CallingStatus;
  nextCallAt: string | null;
  callAttempt: number;
  canUndo: boolean;
};

export type CallingResponse = {
  status: 'ok' | 'rejected';
  message: string | null;
  lead: LeadCard | null;
  savedCall: SavedCall | null;
  nextDueAt: string | null;
};
