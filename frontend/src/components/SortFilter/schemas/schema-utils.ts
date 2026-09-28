// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { FilterNode, GroupNode } from "../filter-types";

export function makeOptions<T extends { id: string; label: string; implies?: string[] }>(items: T[]) {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    type: 'option' as const,
    ...(item.implies ? { implies: item.implies } : {}),
  }));
}
  
export const makeGroup = (
  id: string,
  label: string,
  selection: 'multi' | 'single' | 'none',
  children: FilterNode[]
): GroupNode => ({
  id,
  label,
  type: 'group',
  selection,
  children,
});