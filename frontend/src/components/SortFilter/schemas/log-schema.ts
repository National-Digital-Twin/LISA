// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { FilterTree, GroupNode, SortOption } from '../filter-types';

export const logSort: SortOption[] = [
  { id: 'author_asc', label: 'Author (A-Z)' },
  { id: 'author_desc', label: 'Author (Z-A)' },
  { id: 'date_desc', label: 'Newest - oldest' },
  { id: 'date_asc', label: 'Oldest - newest' },
];

export const buildLogFilters = (templateForms: { id: string; title: string }[], authors: string[] = []): FilterTree => ({
  title: 'Sort & Filter',
  items: [
    {
      id: 'sort',
      type: 'group',
      label: 'Sort by',
      selection: 'single',
      children: logSort.map((opt) => ({
        id: opt.id,
        type: 'option',
        label: opt.label,
      })),
    } as GroupNode,
    {
      id: 'attachment',
      type: 'group',
      label: 'Attachment',
      selection: 'multi',
      children: [
        { id: 'file',  type: 'option', label: 'File' },
        { id: 'location', type: 'option', label: 'Location' },
        { id: 'recording', type: 'option', label: 'Recording' },
        { id: 'sketch', type: 'option', label: 'Sketch' },
      ],
    } as GroupNode,
    {
      id: 'author',
      type: 'group',
      label: 'Author',
      selection: 'multi',
      children: authors.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        type: 'option',
        label: name,
      })),
    } as GroupNode,
    {
      id: 'logType',
      type: 'group',
      label: 'Log type',
      selection: 'none',
      children: [
        {
          id: 'logType.form',
          type: 'group',
          label: 'Form',
          selection: 'multi',
          children: [
            { id: 'action', type: 'option', label: 'Action' },
            { id: 'communication', type: 'option', label: 'Communication' },
            { id: 'decision', type: 'option', label: 'Decision' },
            { id: 'riskassessment', type: 'option', label: 'Risk assessment' },
            { id: 'riskassessmentreview', type: 'option', label: 'Risk assessment review' },
            { id: 'situationreport', type: 'option', label: 'SitRep (M/ETHANE)' },
            ...templateForms.map((f) => ({
              id: `form::${f.id}`,
              type: 'option',
              label: f.title,
            })),
          ],
        } as GroupNode,
        {
          id: 'logType.task',
          type: 'group',
          label: 'Task',
          selection: 'multi',
          children: [
            { id: 'task', type: 'option', label: 'Task' },
          ],
        } as GroupNode,
        {
          id: 'logType.update',
          type: 'group',
          label: 'Update',
          selection: 'multi',
          children: [
            { id: 'general', type: 'option', label: 'Update' },
          ],
        } as GroupNode,
      ],
    } as GroupNode,
    {
      id: 'time',
      type: 'group',
      label: 'Time',
      selection: 'single',
      children: [
        { id: 'last30min', type: 'option', label: 'Last 30 minutes' },
        { id: 'last7hr', type: 'option', label: 'Last 7 hours' },
        { id: 'today', type: 'option', label: 'Today' },
        { id: 'yesterday', type: 'option', label: 'Yesterday' },
        { id: 'last7', type: 'option', label: 'Last 7 days' },
        { id: 'last30', type: 'option', label: 'Last 30 days' },
        { id: 'thisMonth', type: 'option', label: 'This month' },
        { id: 'custom', type: 'option', label: 'Custom date range' },
      ],
    } as GroupNode
  ],
});
