// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export type SortDirection = 'asc' | 'desc';
export type SortOption = { id: string; label: string; field?: string; directions?: SortDirection[] };

export type SelectionMode = 'none' | 'multi' | 'single';

export type FilterNodeBase = {
  id: string;
  label: string;
  helperText?: string;
  hidden?: boolean;
};

export type GroupNode = FilterNodeBase & {
  type: 'group';
  selection: SelectionMode;
  children: FilterNode[];
};

export type OptionLeaf = FilterNodeBase & { type: 'option' };
export type TextLeaf   = FilterNodeBase & { type: 'text'; placeholder?: string; };
export type DateRangeLeaf = FilterNodeBase & { type: 'date-range' };

export type FilterNode = GroupNode | OptionLeaf | TextLeaf | DateRangeLeaf;

export type FilterTree = {
  title?: string;
  items: FilterNode[];
};

export type QueryState = {
  sort?: { by: string; direction: SortDirection };
  values: Record<string, unknown>;
};

export type SortAndFilterProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  sort?: SortOption[];
  initial?: QueryState;
  onApply: (next: QueryState) => void;
  onClear?: () => void;
  tree: FilterTree;
};
