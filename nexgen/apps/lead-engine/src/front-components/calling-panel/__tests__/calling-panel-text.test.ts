import { type SavedCall } from 'src/calling/calling-api-types';
import {
  describeSavedCall,
  formatBusinessType,
  formatPrice,
} from 'src/front-components/calling-panel/calling-panel-text';
import { createRequestId } from 'src/front-components/calling-panel/create-request-id';

const NOW = new Date(2026, 10, 2, 9, 0);

const saved = (overrides: Partial<SavedCall>): SavedCall => ({
  callId: 'call-1',
  outcome: 'NO_ANSWER',
  leadName: "Ballard's Plumbing",
  newStatus: 'SNOOZED',
  nextCallAt: new Date(2026, 10, 2, 12, 0).toISOString(),
  callAttempt: 2,
  canUndo: true,
  ...overrides,
});

describe('describeSavedCall', () => {
  it('says when a snoozed lead comes back and on which call', () => {
    expect(describeSavedCall(saved({}), NOW)).toMatch(
      /^No answer on call 2\. Ballard's Plumbing comes back as CALL 3 at 12:00/,
    );
  });

  it('says a fifth no answer goes to Nurture', () => {
    expect(
      describeSavedCall(
        saved({ callAttempt: 5, newStatus: 'NURTURE', nextCallAt: new Date(2027, 4, 2).toISOString() }),
        NOW,
      ),
    ).toMatch(/^No answer on call 5\. Ballard's Plumbing moved to Nurture until /);
  });

  it('confirms an answered call moved the lead to Spoken to', () => {
    expect(
      describeSavedCall(saved({ outcome: 'ANSWERED', newStatus: 'SPOKEN_TO', nextCallAt: null }), NOW),
    ).toBe("Answered on call 2. Ballard's Plumbing moved to Spoken to.");
  });

  it('confirms a DNQ will not come back', () => {
    expect(
      describeSavedCall(saved({ outcome: 'DNQ', newStatus: 'DISQUALIFIED', nextCallAt: null }), NOW),
    ).toMatch(/will not come back/);
  });
});

describe('formatBusinessType', () => {
  it("turns Google's business type into words", () => {
    expect(formatBusinessType('general_contractor')).toBe('General contractor');
  });
});

describe('formatPrice', () => {
  it('shows whole amounts in the quote currency', () => {
    expect(formatPrice({ amount: 2300, currencyCode: 'AUD' })).toMatch(/2,300/);
  });

  it('falls back to the code when the currency is unknown', () => {
    expect(formatPrice({ amount: 99.6, currencyCode: 'XYZ1' })).toBe('XYZ1 100');
  });
});

describe('createRequestId', () => {
  it('makes a fresh version 4 UUID each time', () => {
    const first = createRequestId();

    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(createRequestId()).not.toBe(first);
  });
});
