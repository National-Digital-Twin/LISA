// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterTree, SortOption } from '../filter-types';
import { makeGroup, makeOptions } from './schema-utils';

export const logSort: SortOption[] = [
  { id: 'author_asc', label: 'Author (A-Z)' },
  { id: 'author_desc', label: 'Author (Z-A)' },
  { id: 'date_desc', label: 'Newest - oldest' },
  { id: 'date_asc', label: 'Oldest - newest' },
];

export const buildLogFilters = (
  templateForms: { id: string; title: string }[],
  authors: string[] = []
): FilterTree => ({
  title: 'Sort & Filter',
  items: [
    makeGroup('sort', 'Sort by', 'single', makeOptions(logSort)),
    makeGroup('attachment', 'Attachment', 'multi', makeOptions([
      { id: 'file', label: 'File' },
      { id: 'location', label: 'Location' },
      { id: 'recording', label: 'Recording' },
      { id: 'sketch', label: 'Sketch' },
    ])),
    makeGroup('author', 'Author', 'multi', makeOptions(
      authors.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        label: name,
      }))
    )),
    makeGroup('logType', 'Log type', 'multi', [
      makeGroup('logType.form', 'Form', 'multi', [
        ...makeOptions([
          { id: 'action', label: 'Action' },
          { id: 'communication', label: 'Communication' },
          { id: 'decision', label: 'Decision' },
          { id: 'riskassessment', label: 'Risk assessment' },
          { id: 'riskassessmentreview', label: 'Risk assessment review' },
          { id: 'situationreport', label: 'SitRep (M/ETHANE)' },
        ]),
        ...templateForms.map((f) => ({
          id: `form::${f.id}`,
          type: 'option' as const,
          label: f.title,
        })),
      ]),
      ...makeOptions([
        { id: 'task', label: 'Task' },
        { id: 'general', label: 'Update' },
      ]),
    ]),
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
  ],
});
