// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntryTypeV2 } from 'common/LogEntryType';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';

export function type(entryType: LogEntryTypeV2): string {
  if (LogEntryTypes[entryType]) {
    return LogEntryTypes[entryType].label;
  }
  return LogEntryTypes.general.label;
}
