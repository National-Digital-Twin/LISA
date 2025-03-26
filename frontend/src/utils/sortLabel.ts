interface Item { label: string }

export function sortLabel<T extends Item>(arr: Array<T>): Array<T> {
  return arr.sort((a, b) => a.label.localeCompare(b.label));
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
