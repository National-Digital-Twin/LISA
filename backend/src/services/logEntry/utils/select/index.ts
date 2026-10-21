// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { attachments } from './attachments';
import { details } from './details';
import { fields } from './fields';
import { logEntries } from './logEntries';
import { mentionedByLogEntryInLogContent } from './mentionedByLogEntry';
import { mentionsLogEntryInLogContent } from './mentionsLogEntry';
import { mentionsUserInLogContent } from './mentionsUser';

export function selectAll(incidentId: string, accessToken?: string) {
  return [
    logEntries(incidentId, accessToken),
    fields(incidentId, accessToken),
    mentionedByLogEntryInLogContent(incidentId, accessToken),
    mentionsLogEntryInLogContent(incidentId, accessToken),
    mentionsUserInLogContent(incidentId, accessToken),
    attachments(incidentId, accessToken),
    details(incidentId, accessToken)
  ];
}
