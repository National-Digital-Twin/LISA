// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

interface Item { value: string }
export function deduplicate<T extends Item>(arr: Array<T>): Array<T> {
  return arr.filter(
    (item, index) => arr.findIndex((i) => i.value === item.value) === index
  );
}
