// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { attachments } from './attachments';
import { fields } from './fields';
import { logEntries } from './logEntries';
import { mentionedByLogEntry } from './mentionedByLogEntry';
import { mentionsLogEntry } from './mentionsLogEntry';
import { mentionsUser } from './mentionsUser';

export function selectAll(incidentId: string) {
  return [
    logEntries(incidentId),
    fields(incidentId),
    mentionedByLogEntry(incidentId),
    mentionsLogEntry(incidentId),
    mentionsUser(incidentId),
    attachments(incidentId)
  ];
}
