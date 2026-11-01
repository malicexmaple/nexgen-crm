type ZonedDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const getZonedDateTime = (instant: Date, timeZone: string): ZonedDateTime => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(instant);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: getPart('hour'),
    minute: getPart('minute'),
    second: getPart('second'),
  };
};

const getTimeZoneOffsetMs = (instant: Date, timeZone: string): number => {
  const zoned = getZonedDateTime(instant, timeZone);
  const wallClockAsUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second,
  );

  return wallClockAsUtc - Math.floor(instant.getTime() / 1000) * 1000;
};

// Keeps the local wall-clock time and clamps to the last day of a shorter month
// (31 Aug + 6 = 28 Feb, or 29 Feb in a leap year).
export const addCalendarMonths = (
  instant: Date,
  months: number,
  timeZone: string,
): Date => {
  const local = getZonedDateTime(instant, timeZone);
  const monthIndex = local.month - 1 + months;
  const year = local.year + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const wallClockAsUtc = Date.UTC(
    year,
    month,
    Math.min(local.day, daysInMonth),
    local.hour,
    local.minute,
    local.second,
    instant.getUTCMilliseconds(),
  );
  const firstGuess =
    wallClockAsUtc - getTimeZoneOffsetMs(new Date(wallClockAsUtc), timeZone);

  return new Date(
    wallClockAsUtc - getTimeZoneOffsetMs(new Date(firstGuess), timeZone),
  );
};
