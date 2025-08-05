// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterNode, GroupNode } from "../filter-types";

export const makeOptions = (opts: { id: string; label: string }[]): FilterNode[] =>
  opts.map((opt) => ({
    id: opt.id,
    label: opt.label,
    type: 'option' as const,
  }));
  
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