import { relativeTime, time } from '../time';

describe('time', () => {
  it('should return an empty string when no date string is provided', () => {
    expect(time('')).toBe('');
  });

  it('should return a time formatted as "HH:mm" for a valid date string', () => {
    const dateStr = '2023-10-05T14:23:30Z';
    const result = time(dateStr);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('relativeTime', () => {
  it('should return an empty string when no date string is provided', () => {
    expect(relativeTime('')).toBe('');
  });

  it("should return time format for today's date", () => {
    const today = new Date();
    const dateStr = today.toISOString();
    const result = relativeTime(dateStr);

    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should return relative time for older dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString();
    const result = relativeTime(dateStr);

    expect(result).toMatch(/ago$/);
  });

  it('should handle invalid date strings gracefully', () => {
    const result = relativeTime('invalid-date');

    expect(result).toBe('');
  });

  it('should return relative time for different time periods', () => {
    const now = new Date();

    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(relativeTime(twoDaysAgo.toISOString())).toMatch(/ago/);

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    expect(relativeTime(oneWeekAgo.toISOString())).toMatch(/ago/);

    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(relativeTime(oneMonthAgo.toISOString())).toMatch(/ago/);
  });

  it('should handle undefined input gracefully', () => {
    const result = relativeTime(undefined);
    expect(result).toBe('');
  });

  it('should return empty string for invalid dates', () => {
    const result = relativeTime('not-a-date');
    expect(result).toBe('');
  });
});
