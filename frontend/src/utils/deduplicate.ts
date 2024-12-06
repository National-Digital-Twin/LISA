interface Item { value: string }
export function deduplicate<T extends Item>(arr: Array<T>): Array<T> {
  return arr.filter(
    (item, index) => arr.findIndex((i) => i.value === item.value) === index
  );
}
