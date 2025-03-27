import { isoDate } from '../isoDate';

describe('isoDate', () => {
  it('should return an empty string when no date is provided', () => {
    expect(isoDate('')).toBe('');
  });

  it('should return a formatted date (yyyy-MM-dd) when a valid date string is provided', () => {
    // Example ISO date string
    const inputDate = '2023-10-05T14:23:30Z';
    // The expected format is based on local UTC date representation,
    // so this test assumes that the conversion does not adjust for timezone.
    const expectedOutput = '2023-10-05';
    expect(isoDate(inputDate)).toBe(expectedOutput);
  });

  it('should properly format another valid date string', () => {
    const inputDate = '2021-03-15T12:40:00Z';
    const expectedOutput = '2021-03-15';
    expect(isoDate(inputDate)).toBe(expectedOutput);
  });
});
