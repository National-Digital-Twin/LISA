// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterTree, SortOption } from '../filter-types';
import { makeGroup, makeOptions } from './schema-utils';

export const taskSort: SortOption[] = [
  { id: 'name_asc', label: 'Task name (A-Z)' },
  { id: 'name_desc', label: 'Task name (Z-A)' },
  { id: 'author_asc', label: 'Created by (A-Z)' },
  { id: 'author_desc', label: 'Created by (Z-A)' },
  { id: 'date_asc', label: 'Date created (oldest - newest)' },
  { id: 'date_desc', label: 'Date created (newest - oldest)' }
];

export const buildTaskFilters = (
  authors: { username: string; displayName: string }[] = [],
  assignees: { username: string; displayName: string }[] = [],
  incidents: { id: string; name: string }[] = []
): FilterTree => ({
  title: 'Sort & Filter',
  items: [
    makeGroup('sort', 'Sort by', 'single', makeOptions(taskSort)),
    makeGroup(
      'author',
      'Author',
      'multi',
      makeOptions(
        authors.map((user) => ({
          id: user.username,
          label: user.displayName
        }))
      )
    ),
    makeGroup(
      'assignee',
      'Assignee',
      'multi',
      makeOptions(
        assignees.map((user) => ({
          id: user.username,
          label: user.displayName
        }))
      )
    ),
    makeGroup(
      'incident',
      'Incident',
      'multi',
      makeOptions(
        incidents.map((incident) => ({
          id: incident.id,
          label: incident.name
        }))
      )
    ),
    makeGroup(
      'status',
      'Status',
      'multi',
      makeOptions([
        { id: 'ToDo', label: 'To do' },
        { id: 'InProgress', label: 'In progress' },
        { id: 'Done', label: 'Done' }
      ])
    )
  ]
});
