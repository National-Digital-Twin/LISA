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
