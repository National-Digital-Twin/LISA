// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/* eslint-disable no-redeclare */
import { Static, Record, String, Optional, Literal, Union } from 'runtypes';
import { User } from './User';

export const TaskStatus = Union(
  Literal('Open'),
  Literal('InProgress'),
  Literal('Closed')
);

export type TaskStatus = Static<typeof TaskStatus>;

export const Task = Record({
  include: Optional(String),
  id: Optional(String),
  name: Optional(String),
  description: Optional(String),
  assignee: Optional(User),
  status: Optional(TaskStatus)
});

export type Task = Static<typeof Task>;
