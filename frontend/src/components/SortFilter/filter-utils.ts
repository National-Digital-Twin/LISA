// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterTree, GroupNode, OptionLeaf } from "./filter-types";

export const resolveTimeRange = (preset: string | undefined): { from?: number; to?: number } => {
  const now = new Date();
  const today = new Date(now.toDateString());
  switch (preset) {
    case 'last30min': {
      const from = new Date(now);
      from.setMinutes(from.getMinutes() - 30);
      return { from: from.getTime(), to: now.getTime() };
    }
    case 'last7hr': {
      const from = new Date(now);
      from.setHours(from.getHours() - 7);
      return { from: from.getTime(), to: now.getTime() };
    }
    case 'today':
      return { from: today.getTime(), to: now.getTime() };
    case 'yesterday': {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const end = new Date(today);
      end.setMilliseconds(-1);
      return { from: y.getTime(), to: end.getTime() };
    }
    case 'last7': {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      return { from: from.getTime(), to: now.getTime() };
    }
    case 'last30': {
      const from = new Date(today);
      from.setDate(from.getDate() - 29);
      return { from: from.getTime(), to: now.getTime() };
    }
    case 'thisMonth': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: from.getTime(), to: now.getTime() };
    }
    default:
      return {};
  }
};

export const applyImpliedSelections = (
  selected: Set<string>,
  groupId: string,
  tree: FilterTree
): { selected: Set<string>; locked: Set<string> } => {
  const locked = new Set<string>();
  
  const group = tree.items.find((item) =>
    item.type === 'group' && item.id === groupId
  ) as GroupNode | undefined;
  
  if (!group) return { selected, locked };
  
  const options = group.children.filter((c): c is OptionLeaf => c.type === 'option');
  
  const implied = new Set<string>();
  options
    .filter((opt) => selected.has(opt.id) && Array.isArray(opt.implies))
    .flatMap((opt) => opt.implies ?? [])
    .forEach((id) => {
      implied.add(id);
      locked.add(id);
    });
  
  return {
    selected: new Set([...selected, ...implied]),
    locked,
  };
};
  