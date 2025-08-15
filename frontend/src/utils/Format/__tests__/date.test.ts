import { date } from '../date';

process.env.TZ = 'UTC';

const localOnly = process.env.GITHUB_ACTIONS === 'true' ? describe.skip : describe;

localOnly('date function', () => {
  it('should format a valid ISO date string', () => {
    const input = '2020-04-30T00:00:00.000Z';
    const expected = '30 Apr 2020';
    expect(date(input)).toBe(expected);
  });

  it('should return an empty string when input is empty', () => {
    const input = '';
    expect(date(input)).toBe('');
  });
});