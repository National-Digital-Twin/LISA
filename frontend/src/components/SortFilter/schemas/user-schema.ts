// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterTree, SortOption } from '../filter-types';
import { makeGroup, makeOptions } from './schema-utils';

export const userSort: SortOption[] = [
  { id: 'displayName_asc', label: 'Name (A-Z)' },
  { id: 'displayName_desc', label: 'Name (Z-A)' }
];

export const buildUserFilters = (
): FilterTree => ({
  title: 'Sort & Filter',
  items: [
    makeGroup('sort', 'Sort by', 'single', makeOptions(userSort)),
    {
      id: 'search',
      type: 'text',
      label: 'Search',
      placeholder: 'Search by name or organisation',
      helperText: 'Filters users by name or organisation',
    },
  ],
});
