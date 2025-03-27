import { deduplicate } from '../deduplicate';

interface TestItem {
  value: string;
  // additional properties can be added if needed
}

describe('deduplicate', () => {
  it('should return an empty array when an empty array is provided', () => {
    const input: TestItem[] = [];
    const result = deduplicate(input);
    expect(result).toEqual([]);
  });

  it('should return the same array if there are no duplicates', () => {
    const input: TestItem[] = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
    const result = deduplicate(input);
    expect(result).toEqual(input);
  });

  it('should remove duplicate items based on their "value" property', () => {
    const input: TestItem[] = [
      { value: 'a' },
      { value: 'b' },
      { value: 'a' }, // duplicate
      { value: 'c' },
      { value: 'b' } // duplicate
    ];
    const result = deduplicate(input);
    expect(result).toEqual([{ value: 'a' }, { value: 'b' }, { value: 'c' }]);
  });

  it('should preserve only the first occurrence of each duplicate', () => {
    const input: TestItem[] = [{ value: 'x' }, { value: 'x' }, { value: 'x' }];
    const result = deduplicate(input);
    expect(result).toEqual([{ value: 'x' }]);
  });
});
