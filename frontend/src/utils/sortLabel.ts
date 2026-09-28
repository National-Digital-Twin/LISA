// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

interface Item { label: string }

export function sortLabel<T extends Item>(arr: Array<T>): Array<T> {
  return arr.sort((a, b) => a.label.localeCompare(b.label));
}
