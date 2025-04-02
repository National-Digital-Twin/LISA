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
