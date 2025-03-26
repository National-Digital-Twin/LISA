import { type IncidentAttachment } from 'common/IncidentAttachment';
import { type LogEntryAttachment } from 'common/LogEntryAttachment';
import { type Mentionable } from 'common/Mentionable';

export function attachment(item: LogEntryAttachment | IncidentAttachment): Mentionable {
  const entryId = (item as IncidentAttachment).logEntryId;
  return {
    id: `${entryId || 'this'}::${item.name}`,
    label: item.name,
    type: 'File'
  };
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
