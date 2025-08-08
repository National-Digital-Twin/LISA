// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Static, Record, String, Optional, Literal, Union } from 'runtypes';
import { User } from './User';

export const TaskStatus = Union(Literal('ToDo'), Literal('InProgress'), Literal('Done'));

export type TaskStatus = Static<typeof TaskStatus>;

export const CreateTask = Record({
  id: Optional(String),
  name: String,
  description: Optional(String),
  incidentId: String,
  assignee: User,
  status: Optional(TaskStatus),
  sequence: String
});

export const Task = Record({
  id: String,
  name: String,
  description: String,
  incidentId: String,
  author: User,
  assignee: User,
  status: TaskStatus,
  sequence: String,
  createdAt: String
});

export type CreateTask = Static<typeof CreateTask>;
export type Task = Static<typeof Task>;
