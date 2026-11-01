import {
  applyCallOutcome,
  applyReactivation,
  buildCallEntryName,
  type CallEntry,
  getNurtureReturnState,
  getOutcomeRejection,
  getSnoozeReturnState,
  type LeadCallingState,
} from 'src/calling/calling-rules';
import { type CallOutcome } from 'src/constants/select-options';

const FRESH_LEAD: LeadCallingState = {
  callingStatus: 'READY',
  callAttempt: 1,
  callingCycle: 1,
  totalCallAttempts: 0,
  lastCallAt: null,
  lastCallOutcome: null,
  nextCallAt: null,
  answeredAt: null,
  lastCalledById: null,
  dnqAt: null,
  dnqReason: null,
  nurtureReason: null,
  leadStatus: 'PITCH_READY',
  lastCallRequestId: null,
};

const CALLED_AT = new Date('2026-11-02T00:00:00.000Z');

const call = (
  state: LeadCallingState,
  outcome: CallOutcome,
  { note = null, calledAt = CALLED_AT }: { note?: string | null; calledAt?: Date } = {},
) =>
  applyCallOutcome({
    state,
    outcome,
    calledAt,
    calledById: 'member-1',
    requestId: `request-${outcome}-${state.totalCallAttempts}`,
    note,
    timeZone: 'Australia/Sydney',
  });

const atAttempt = (callAttempt: number): LeadCallingState => ({
  ...FRESH_LEAD,
  callAttempt,
  totalCallAttempts: callAttempt - 1,
});

describe('No answer', () => {
  it.each([1, 2, 3, 4])('snoozes call %i for 3 hours, then returns as the next call', (attempt) => {
    const { nextState, entry } = call(atAttempt(attempt), 'NO_ANSWER');

    expect(nextState).toMatchObject({
      callingStatus: 'SNOOZED',
      callAttempt: attempt + 1,
      totalCallAttempts: attempt,
      lastCallOutcome: 'NO_ANSWER',
      lastCallAt: CALLED_AT.toISOString(),
      lastCalledById: 'member-1',
      nextCallAt: '2026-11-02T03:00:00.000Z',
    });
    expect(entry).toEqual({
      outcome: 'NO_ANSWER',
      callAttempt: attempt,
      callingCycle: 1,
      previousStatus: 'READY',
      newStatus: 'SNOOZED',
      nextCallAt: '2026-11-02T03:00:00.000Z',
    });
    expect(getSnoozeReturnState(nextState)).toMatchObject({
      callingStatus: 'READY',
      callAttempt: attempt + 1,
      nextCallAt: null,
    });
  });

  it('moves call 5 to Nurture for six calendar months, then back as call 1', () => {
    const { nextState } = call(atAttempt(5), 'NO_ANSWER');

    expect(nextState).toMatchObject({
      callingStatus: 'NURTURE',
      callAttempt: 1,
      totalCallAttempts: 5,
      lastCallOutcome: 'NO_ANSWER',
      nextCallAt: '2027-05-02T01:00:00.000Z',
      nurtureReason: 'No answer after 5 calls',
    });
    expect(getNurtureReturnState(nextState)).toMatchObject({
      callingStatus: 'READY',
      callAttempt: 1,
      callingCycle: 2,
      nextCallAt: null,
    });
  });
});

describe('Nurture', () => {
  it('resets call 3 to call 1 and returns in six calendar months', () => {
    const { nextState, entry } = call(atAttempt(3), 'NURTURE', { note: 'Busy until winter' });

    expect(nextState).toMatchObject({
      callingStatus: 'NURTURE',
      callAttempt: 1,
      totalCallAttempts: 3,
      lastCallOutcome: 'NURTURE',
      nextCallAt: '2027-05-02T01:00:00.000Z',
      nurtureReason: 'Busy until winter',
    });
    expect(entry).toMatchObject({ callAttempt: 3, newStatus: 'NURTURE' });
  });

  it('follows the calendar across month ends', () => {
    const { nextState } = call(FRESH_LEAD, 'NURTURE', {
      calledAt: new Date('2027-08-31T00:00:00.000Z'),
    });

    expect(nextState.nextCallAt).toBe('2028-02-28T23:00:00.000Z');
  });
});

describe('DNQ', () => {
  it('disqualifies call 2 permanently and marks the lead lost', () => {
    const { nextState } = call(
      { ...atAttempt(2), nextCallAt: '2026-01-01T00:00:00.000Z' },
      'DNQ',
      { note: 'Not a business' },
    );

    expect(nextState).toMatchObject({
      callingStatus: 'DISQUALIFIED',
      callAttempt: 2,
      totalCallAttempts: 2,
      lastCallOutcome: 'DNQ',
      nextCallAt: null,
      dnqAt: CALLED_AT.toISOString(),
      dnqReason: 'Not a business',
      leadStatus: 'LOST',
    });
  });
});

describe('Answered', () => {
  it('moves the lead to Spoken to without advancing the call number', () => {
    const { nextState, entry } = call(atAttempt(3), 'ANSWERED');

    expect(nextState).toMatchObject({
      callingStatus: 'SPOKEN_TO',
      callAttempt: 3,
      totalCallAttempts: 3,
      lastCallOutcome: 'ANSWERED',
      answeredAt: CALLED_AT.toISOString(),
      nextCallAt: null,
      leadStatus: 'PITCH_READY',
    });
    expect(entry).toMatchObject({ callAttempt: 3, newStatus: 'SPOKEN_TO' });
  });
});

describe('several calling cycles', () => {
  it('keeps every attempt in the history and counts them all', () => {
    const entries: CallEntry[] = [];
    let state = FRESH_LEAD;
    const record = (outcome: CallOutcome) => {
      const transition = call(state, outcome);

      entries.push(transition.entry);
      state = transition.nextState;
    };

    for (let attempt = 1; attempt <= 5; attempt++) {
      record('NO_ANSWER');
      state = state.callingStatus === 'SNOOZED' ? getSnoozeReturnState(state) : state;
    }
    state = getNurtureReturnState(state);
    record('NO_ANSWER');
    state = getSnoozeReturnState(state);
    record('NURTURE');
    state = getNurtureReturnState(state);

    expect(entries.map(buildCallEntryName)).toEqual([
      'Cycle 1 · Call 1 · No answer',
      'Cycle 1 · Call 2 · No answer',
      'Cycle 1 · Call 3 · No answer',
      'Cycle 1 · Call 4 · No answer',
      'Cycle 1 · Call 5 · No answer',
      'Cycle 2 · Call 1 · No answer',
      'Cycle 2 · Call 2 · Nurture',
    ]);
    expect(entries[4].newStatus).toBe('NURTURE');
    expect(state).toMatchObject({
      callingStatus: 'READY',
      callAttempt: 1,
      callingCycle: 3,
      totalCallAttempts: 7,
    });
  });
});

describe('getOutcomeRejection', () => {
  it('accepts a ready lead on the call the salesperson is looking at', () => {
    expect(
      getOutcomeRejection({ state: atAttempt(2), expectedAttempt: 2, expectedCycle: 1 }),
    ).toBeNull();
  });

  it('rejects a call already recorded by someone else', () => {
    const { nextState } = call(atAttempt(2), 'NO_ANSWER');

    expect(
      getOutcomeRejection({ state: nextState, expectedAttempt: 2, expectedCycle: 1 }),
    ).toMatch(/already recorded/);
  });

  it('rejects a screen that shows an old call number', () => {
    expect(
      getOutcomeRejection({ state: atAttempt(3), expectedAttempt: 2, expectedCycle: 1 }),
    ).toMatch(/changed/);
  });

  it('never accepts a call on a DNQ lead, even with an old next call date', () => {
    const { nextState } = call(atAttempt(2), 'DNQ');

    expect(
      getOutcomeRejection({
        state: { ...nextState, nextCallAt: '2020-01-01T00:00:00.000Z' },
        expectedAttempt: 2,
        expectedCycle: 1,
      }),
    ).toMatch(/DNQ/);
  });
});

describe('applyReactivation', () => {
  it('puts a Spoken to lead back as call 1 of a new cycle', () => {
    const answered = call(atAttempt(3), 'ANSWERED').nextState;
    const { nextState, entry } = applyReactivation({ state: answered, requestId: 'r1' });

    expect(nextState).toMatchObject({
      callingStatus: 'READY',
      callAttempt: 1,
      callingCycle: 2,
      totalCallAttempts: 3,
      nextCallAt: null,
      lastCallRequestId: 'r1',
    });
    expect(entry).toMatchObject({
      outcome: 'REACTIVATED',
      previousStatus: 'SPOKEN_TO',
      newStatus: 'READY',
    });
  });

  it('clears the DNQ and takes the lead off Lost', () => {
    const disqualified = call(atAttempt(2), 'DNQ', { note: 'Wrong number' }).nextState;
    const { nextState } = applyReactivation({ state: disqualified, requestId: 'r2' });

    expect(nextState).toMatchObject({
      callingStatus: 'READY',
      dnqAt: null,
      dnqReason: null,
      leadStatus: 'CALLED',
    });
  });
});
