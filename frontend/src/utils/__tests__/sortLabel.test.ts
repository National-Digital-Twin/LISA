import { sortLabel } from '../sortLabel';

interface Item {
  label: string;
}

describe('sortLabel', () => {
  it('should sort an array of items by their labels in ascending order', () => {
    const unsortedItems: Item[] = [{ label: 'Charlie' }, { label: 'Alice' }, { label: 'Bob' }];

    const expectedOrder = ['Alice', 'Bob', 'Charlie'];
    const sortedItems = sortLabel(unsortedItems);

    expect(sortedItems.map((item) => item.label)).toEqual(expectedOrder);
  });
});
