import { timestamp } from '../timestamp';

describe('timestamp', () => {
  it('should use the provided date', () => {
    const testDate = new Date('2023-10-05T14:23:30Z');
    const expected = '2023-10-05 at 14:23:30';
    expect(timestamp(testDate)).toBe(expected);
  });

  it('should return a valid timestamp string using the current date when none is provided', () => {
    const result = timestamp();
    // Test that the result follows the expected pattern, e.g. "YYYY-MM-DD at HH:mm:ss"
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} at \d{2}:\d{2}:\d{2}$/);
  });
});
