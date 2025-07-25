// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Static, Object, String, Literal, Union } from 'runtypes';
import { User } from './User';

export const TaskStatus = Union(Literal('ToDo'), Literal('InProgress'), Literal('Done'));

export type TaskStatus = Static<typeof TaskStatus>;

export const Task = Object({
  include: String.optional(),
  id: String.optional(),
  name: String.optional(),
  description: String.optional(),
  assignee: User.optional(),
  status: TaskStatus.optional()
});

export type Task = Static<typeof Task>;
