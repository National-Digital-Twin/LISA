import { pretty } from './index';

describe('pretty.name', () => {
  it('should convert a simple lowercase name to title case', () => {
    const input = 'john doe';
    const expected = 'John Doe';
    expect(pretty.name(input)).toBe(expected);
  });

  it('should handle names with non-word characters', () => {
    const input = 'john-doe';
    const expected = 'John Doe';
    expect(pretty.name(input)).toBe(expected);
  });

  it('should handle names with extra spaces and punctuation', () => {
    const input = '  jane..doe!  ';
    // Explanation: Non-word characters become spaces, then the first letter of each word is capitalized.
    const expected = 'Jane Doe';
    expect(pretty.name(input)).toBe(expected);
  });

  it('should return an empty string if an empty string is provided', () => {
    const input = '';
    expect(pretty.name(input)).toBe('');
  });
});

describe('pretty.initials', () => {
  it('should return the initials for a simple two-word name', () => {
    const input = 'john doe';
    const expected = 'JD';
    expect(pretty.initials(input)).toBe(expected);
  });

  it('should return the initials for a multi-word name', () => {
    const input = 'john doe smith';
    const expected = 'JDS';
    expect(pretty.initials(input)).toBe(expected);
  });

  it('should handle names with dots or extra spaces', () => {
    const input = 'anna.marie lee';
    const expected = 'AML';
    expect(pretty.initials(input)).toBe(expected);
  });

  it('should trim the name before processing', () => {
    const input = '  alice park  ';
    const expected = 'AP';
    expect(pretty.initials(input)).toBe(expected);
  });
});
