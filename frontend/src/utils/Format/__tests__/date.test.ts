import { date } from '../date';

// Set the timezone to UTC for consistent date formatting in tests.
process.env.TZ = 'UTC';

describe('date function', () => {
  it('should format a valid ISO date string', () => {
    // Using an ISO string ensures that new Date(string) creates a valid date.
    const input = '2020-04-30T00:00:00.000Z';
    const expected = '30 Apr 2020';
    expect(date(input)).toBe(expected);
  });

  it('should return an empty string when input is empty', () => {
    const input = '';
    expect(date(input)).toBe('');
  });
});
