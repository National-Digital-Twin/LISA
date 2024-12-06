interface Item { label: string }

export function sortLabel<T extends Item>(arr: Array<T>): Array<T> {
  return arr.sort((a, b) => a.label.localeCompare(b.label));
}
