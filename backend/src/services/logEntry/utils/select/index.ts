// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { attachments } from './attachments';
import { details } from './details';
import { fields } from './fields';
import { logEntries } from './logEntries';
import { mentionedByLogEntryInLogContent } from './mentionedByLogEntry';
import { mentionsLogEntryInLogContent } from './mentionsLogEntry';
import { mentionsUserInLogContent } from './mentionsUser';

export function selectAll(incidentId: string) {
  return [
    logEntries(incidentId),
    fields(incidentId),
    mentionedByLogEntryInLogContent(incidentId),
    mentionsLogEntryInLogContent(incidentId),
    mentionsUserInLogContent(incidentId),
    attachments(incidentId),
    details(incidentId)
  ];
}
