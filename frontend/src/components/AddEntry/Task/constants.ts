// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { Field } from "common/Field";

export const INCLUDE_FIELD: Field = {
  id: 'include',
  type: 'YesNo',
  label: 'Add task?'
};

export const NAME_FIELD: Field = {
  id: 'name',
  type: 'Input',
  label: 'Task name'
};

export const ASSIGNEE_FIELD: Field = {
  id: 'assignee',
  type: 'Select',
  label: 'Assign to'
};

export const DESC_FIELD: Field = {
  id: 'description',
  type: 'TextArea',
  label: 'Task description',
  multiline: true,
  rows: 6
};