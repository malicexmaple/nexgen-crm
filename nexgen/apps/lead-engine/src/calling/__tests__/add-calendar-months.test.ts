import { addCalendarMonths } from 'src/calling/add-calendar-months';

const SYDNEY = 'Australia/Sydney';

describe('addCalendarMonths', () => {
  it('keeps the same day and local time', () => {
    // 10am AEST on 15 Jul is 10am AEDT on 15 Jan: the UTC offset changes with daylight saving.
    expect(
      addCalendarMonths(new Date('2027-07-15T00:00:00.000Z'), 6, SYDNEY).toISOString(),
    ).toBe('2028-01-14T23:00:00.000Z');
  });

  it('clamps the 31st to the end of February', () => {
    expect(
      addCalendarMonths(new Date('2026-08-31T00:00:00.000Z'), 6, SYDNEY).toISOString(),
    ).toBe('2027-02-27T23:00:00.000Z');
  });

  it('lands on 29 February in a leap year', () => {
    expect(
      addCalendarMonths(new Date('2027-08-31T00:00:00.000Z'), 6, SYDNEY).toISOString(),
    ).toBe('2028-02-28T23:00:00.000Z');
  });

  it('uses the local date, not the UTC date', () => {
    // 11pm UTC on 31 Mar is already 10am on 1 Apr in Sydney, so six months on is 1 Oct.
    expect(
      addCalendarMonths(new Date('2027-03-31T23:00:00.000Z'), 6, SYDNEY).toISOString(),
    ).toBe('2027-10-01T00:00:00.000Z');
  });

  it('rolls into the next year', () => {
    expect(
      addCalendarMonths(new Date('2026-11-30T12:00:00.000Z'), 6, 'UTC').toISOString(),
    ).toBe('2027-05-30T12:00:00.000Z');
  });
});
