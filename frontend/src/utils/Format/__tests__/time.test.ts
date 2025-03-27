import { time } from '../time';

describe('time', () => {
  it('should return an empty string when no date string is provided', () => {
    expect(time('')).toBe('');
  });

  it('should return a time formatted as "HH:mm" for a valid date string', () => {
    const dateStr = '2023-10-05T14:23:30Z';
    const result = time(dateStr);

    // The returned time might differ depending on the environment's local timezone,
    // so we verify that it matches the pattern HH:mm (e.g. "14:23", "16:23", etc.)
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});
