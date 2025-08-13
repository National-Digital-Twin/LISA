// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterNode, FilterTree, GroupNode, OptionLeaf, QueryState } from "./filter-types";

const resolveTimeRange = (preset: string | undefined): { from?: number; to?: number } => {
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

export const getFromAndToFromTimeSelection = (preset : string | undefined, timeRange? : {from?: string; to?: string;}) 
: {from : number | undefined, to : number | undefined} => {
  let from: number | undefined;
  let to: number | undefined;
  
  if (preset === 'custom') {
    from = timeRange?.from ? new Date(timeRange.from).getTime() : undefined;
    to = timeRange?.to ? new Date(timeRange.to).getTime() : undefined;
  } else {
    const resolved = resolveTimeRange(preset);
    from = resolved.from;
    to = resolved.to;
  }

  return { from, to };
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
  

export const countActive = (values: QueryState['values']) => 
  Object.entries(values)
    .filter(([key, v]) => {
      if (key === 'sort') return false;
      if (Array.isArray(v)) return v.length > 0;
      if (v == null || v === '') return false;
      if (typeof v === 'object') return Object.values(v).some(Boolean);
      return true;
    })
    .map(([key]) => key.split('.')[0])
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .length;


export const countActiveForGroup = (
  values: QueryState['values'],
  node: FilterNode
): number => {
  switch (node.type) {
    case 'text': {
      const v = values[node.id];
      return typeof v === 'string' && v.trim() ? 1 : 0;
    }
    case 'date-range': {
      const v = values[node.id] as { from?: string; to?: string } | undefined;
      return v?.from || v?.to ? 1 : 0;
    }
    case 'option':
      return 0;
    
    case 'group': {
      if (node.selection === 'single') {
        
        const v = values[node.id];
        return v == null || v === '' ? 0 : 1;
      }
    
      if (node.selection === 'multi') {

        const selfCount = Array.isArray(values[node.id])
          ? (values[node.id] as unknown[]).length
          : 0;

        const childCount = node.children
          .filter((c) => c.type !== 'option')
          .map((c) => countActiveForGroup(values, c))
          .reduce((a, b) => a + b, 0);
    
        return selfCount + childCount;
      }
    
      return node.children
        .map((c) => countActiveForGroup(values, c))
        .reduce((a, b) => a + b, 0);
    }
    default: {
      return 0;
    }
  }
};
