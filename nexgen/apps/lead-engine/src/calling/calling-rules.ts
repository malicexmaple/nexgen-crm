import { addCalendarMonths } from 'src/calling/add-calendar-months';
import {
  type CallHistoryOutcome,
  type CallingStatus,
  type CallOutcome,
  type LeadStatus,
} from 'src/constants/select-options';

export const MAX_CALL_ATTEMPTS = 5;
export const SNOOZE_HOURS = 3;
export const NURTURE_MONTHS = 6;
export const CALL_CLAIM_MINUTES = 10;
export const UNDO_WINDOW_MINUTES = 10;

export const CALL_OUTCOMES: CallOutcome[] = ['ANSWERED', 'NO_ANSWER', 'NURTURE', 'DNQ'];
export const REACTIVATABLE_STATUSES: CallingStatus[] = ['SPOKEN_TO', 'NURTURE', 'DISQUALIFIED'];

export type LeadCallingState = {
  callingStatus: CallingStatus;
  callAttempt: number;
  callingCycle: number;
  totalCallAttempts: number;
  lastCallAt: string | null;
  lastCallOutcome: CallOutcome | null;
  nextCallAt: string | null;
  answeredAt: string | null;
  lastCalledById: string | null;
  dnqAt: string | null;
  dnqReason: string | null;
  nurtureReason: string | null;
  leadStatus: LeadStatus | null;
  lastCallRequestId: string | null;
};

export type CallEntry = {
  outcome: CallHistoryOutcome;
  callAttempt: number;
  callingCycle: number;
  previousStatus: CallingStatus;
  newStatus: CallingStatus;
  nextCallAt: string | null;
};

export type CallingTransition = {
  nextState: LeadCallingState;
  entry: CallEntry;
};

const OUTCOME_LABELS: Record<CallHistoryOutcome, string> = {
  ANSWERED: 'Answered',
  NO_ANSWER: 'No answer',
  NURTURE: 'Nurture',
  DNQ: 'DNQ',
  REACTIVATED: 'Moved back to Ready to call',
};

export const isCallOutcome = (value: unknown): value is CallOutcome =>
  CALL_OUTCOMES.includes(value as CallOutcome);

export const buildCallEntryName = (entry: CallEntry): string =>
  entry.outcome === 'REACTIVATED'
    ? `Cycle ${entry.callingCycle} · ${OUTCOME_LABELS.REACTIVATED}`
    : `Cycle ${entry.callingCycle} · Call ${entry.callAttempt} · ${OUTCOME_LABELS[entry.outcome]}`;

const toNurture = (
  state: LeadCallingState,
  calledAt: Date,
  timeZone: string,
  nurtureReason: string | null,
): LeadCallingState => ({
  ...state,
  callingStatus: 'NURTURE',
  callAttempt: 1,
  nextCallAt: addCalendarMonths(calledAt, NURTURE_MONTHS, timeZone).toISOString(),
  nurtureReason,
});

const getStateAfterOutcome = ({
  recorded,
  outcome,
  calledAt,
  note,
  timeZone,
}: {
  recorded: LeadCallingState;
  outcome: CallOutcome;
  calledAt: Date;
  note: string | null;
  timeZone: string;
}): LeadCallingState => {
  switch (outcome) {
    case 'ANSWERED':
      return {
        ...recorded,
        callingStatus: 'SPOKEN_TO',
        nextCallAt: null,
        answeredAt: calledAt.toISOString(),
      };
    case 'NO_ANSWER':
      return recorded.callAttempt < MAX_CALL_ATTEMPTS
        ? {
            ...recorded,
            callingStatus: 'SNOOZED',
            callAttempt: recorded.callAttempt + 1,
            nextCallAt: new Date(
              calledAt.getTime() + SNOOZE_HOURS * 60 * 60 * 1000,
            ).toISOString(),
          }
        : toNurture(
            recorded,
            calledAt,
            timeZone,
            note ?? `No answer after ${MAX_CALL_ATTEMPTS} calls`,
          );
    case 'NURTURE':
      return toNurture(recorded, calledAt, timeZone, note);
    case 'DNQ':
      return {
        ...recorded,
        callingStatus: 'DISQUALIFIED',
        nextCallAt: null,
        dnqAt: calledAt.toISOString(),
        dnqReason: note,
        leadStatus: 'LOST',
      };
  }
};

export const applyCallOutcome = ({
  state,
  outcome,
  calledAt,
  calledById,
  requestId,
  note,
  timeZone,
}: {
  state: LeadCallingState;
  outcome: CallOutcome;
  calledAt: Date;
  calledById: string | null;
  requestId: string;
  note: string | null;
  timeZone: string;
}): CallingTransition => {
  const recorded: LeadCallingState = {
    ...state,
    totalCallAttempts: state.totalCallAttempts + 1,
    lastCallAt: calledAt.toISOString(),
    lastCallOutcome: outcome,
    lastCalledById: calledById,
    lastCallRequestId: requestId,
  };
  const nextState = getStateAfterOutcome({ recorded, outcome, calledAt, note, timeZone });

  return {
    nextState,
    entry: {
      outcome,
      callAttempt: state.callAttempt,
      callingCycle: state.callingCycle,
      previousStatus: state.callingStatus,
      newStatus: nextState.callingStatus,
      nextCallAt: nextState.nextCallAt,
    },
  };
};

export const applyReactivation = ({
  state,
  requestId,
}: {
  state: LeadCallingState;
  requestId: string;
}): CallingTransition => {
  const wasDisqualified = state.callingStatus === 'DISQUALIFIED';
  const nextState: LeadCallingState = {
    ...state,
    callingStatus: 'READY',
    callAttempt: 1,
    callingCycle: state.callingCycle + 1,
    nextCallAt: null,
    lastCallRequestId: requestId,
    ...(wasDisqualified
      ? {
          dnqAt: null,
          dnqReason: null,
          leadStatus: state.leadStatus === 'LOST' ? 'CALLED' : state.leadStatus,
        }
      : {}),
  };

  return {
    nextState,
    entry: {
      outcome: 'REACTIVATED',
      callAttempt: nextState.callAttempt,
      callingCycle: nextState.callingCycle,
      previousStatus: state.callingStatus,
      newStatus: 'READY',
      nextCallAt: null,
    },
  };
};

export const getSnoozeReturnState = (state: LeadCallingState): LeadCallingState => ({
  ...state,
  callingStatus: 'READY',
  nextCallAt: null,
});

export const getNurtureReturnState = (state: LeadCallingState): LeadCallingState => ({
  ...state,
  callingStatus: 'READY',
  callAttempt: 1,
  callingCycle: state.callingCycle + 1,
  nextCallAt: null,
});

const NOT_READY_MESSAGES: Record<Exclude<CallingStatus, 'READY'>, string> = {
  SNOOZED: 'This call was already recorded. The lead is snoozed until its next call.',
  NURTURE: 'This lead is in Nurture.',
  SPOKEN_TO: 'This lead has already been spoken to.',
  DISQUALIFIED: 'This lead is DNQ. Only a calling admin can move it back.',
};

export const getOutcomeRejection = ({
  state,
  expectedAttempt,
  expectedCycle,
}: {
  state: LeadCallingState;
  expectedAttempt: number;
  expectedCycle: number;
}): string | null => {
  if (state.callingStatus !== 'READY') {
    return NOT_READY_MESSAGES[state.callingStatus];
  }

  if (state.callAttempt !== expectedAttempt || state.callingCycle !== expectedCycle) {
    return 'This lead changed since you opened it. Showing the latest.';
  }

  return null;
};
