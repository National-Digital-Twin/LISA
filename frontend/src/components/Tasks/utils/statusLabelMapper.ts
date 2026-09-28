// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import type { TaskStatus } from 'common/Task';

export const STATUS_LABELS = {
  ToDo: 'To do',
  InProgress: 'In progress',
  Done: 'Done',
} as const satisfies Record<TaskStatus, string>;

export const toStatusHumanReadable = (s: TaskStatus) => STATUS_LABELS[s];