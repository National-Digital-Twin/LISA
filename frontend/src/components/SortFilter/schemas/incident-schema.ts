// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterTree, SortOption } from '../filter-types';
import { makeGroup, makeOptions } from './schema-utils';

export const incidentSort: SortOption[] = [
  { id: 'name_asc', label: 'Name (A-Z)' },
  { id: 'name_desc', label: 'Name (Z-A)' },
  { id: 'reportedby_asc', label: 'Reported by (A-Z)' },
  { id: 'reportedby_desc', label: 'Reported by (Z-A)' },
  { id: 'date_desc', label: 'Newest - oldest' },
  { id: 'date_asc', label: 'Oldest - newest' },
];

export const buildIncidentFilters = (
  incidentTypes: { id: string; label: string }[],
  authors: string[] = []
): FilterTree => ({
  title: 'Sort & Filter',
  items: [
    makeGroup('sort', 'Sort by', 'single', makeOptions(incidentSort)),
    makeGroup('author', 'Author', 'multi', makeOptions(
      authors.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        label: name,
      }))
    )),
    makeGroup('type', 'Incident type', 'multi', makeOptions(incidentTypes)),
    makeGroup('time', 'Time', 'single', makeOptions([
      { id: 'last30min', label: 'Last 30 minutes' },
      { id: 'last7hr', label: 'Last 7 hours' },
      { id: 'today', label: 'Today' },
      { id: 'yesterday', label: 'Yesterday' },
      { id: 'last7', label: 'Last 7 days' },
      { id: 'last30', label: 'Last 30 days' },
      { id: 'thisMonth', label: 'This month' },
      { id: 'custom', label: 'Custom date range' },
    ])),
    makeGroup('stage', 'Stage', 'multi', makeOptions([
      { id: 'all', label: 'All', implies: ['active', 'monitoring', 'recovery', 'response', 'closed'] },
      { id: 'active', label: 'Active', implies: ['monitoring', 'recovery', 'response'] },
      { id: 'monitoring', label: 'Monitoring' },
      { id: 'recovery', label: 'Recovery' },
      { id: 'response', label: 'Response' },
      { id: 'closed', label: 'Closed' },
    ])),
  ],
});
