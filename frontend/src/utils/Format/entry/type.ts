// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type LogEntryType } from 'common/LogEntryType';
 
import { LogEntryTypes } from 'common/LogEntryTypes';

export function type(entryType: LogEntryType): string {
  if (LogEntryTypes[entryType]) {
    return LogEntryTypes[entryType].label;
  }
  return LogEntryTypes.General.label;
}
