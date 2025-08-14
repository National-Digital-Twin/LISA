import { dateAndTimeMobile } from '../dateAndTimeMobile';

// Set the timezone to UTC for consistent date formatting in tests.
process.env.TZ = 'Europe/London';

describe('dateAndTimeMobile function', () => {
  it('should format a valid ISO date string with date and time', () => {
    const input = '2020-04-30T12:34:00.000Z';
    const expected = '30 Apr 2020 @ 13:34';
    expect(dateAndTimeMobile(input)).toBe(expected);
  });

  it('should return an empty string when input is empty', () => {
    const input = '';
    expect(dateAndTimeMobile(input)).toBe('');
  });
});
