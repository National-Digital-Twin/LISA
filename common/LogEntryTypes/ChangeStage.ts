// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntryTypesDictItem } from './types';

export const ChangeStage: LogEntryTypesDictItem = {
  label: 'Stage change',
  colour: 'yellow',
  fields: () => [],
  noContent: true,
  stage: true,
  unselectable: () => true
};
