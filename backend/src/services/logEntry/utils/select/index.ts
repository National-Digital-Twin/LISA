// Global imports
import { Request } from 'express';

// Local imports
import { attachments } from './attachments';
import { fields } from './fields';
import { logEntries } from './logEntries';
import { mentionedByLogEntry } from './mentionedByLogEntry';
import { mentionsLogEntry } from './mentionsLogEntry';
import { mentionsUser } from './mentionsUser';

export function selectAll(req: Request, incidentId: string) {
  return [
    logEntries(req, incidentId),
    fields(req, incidentId),
    mentionedByLogEntry(req, incidentId),
    mentionsLogEntry(req, incidentId),
    mentionsUser(req, incidentId),
    attachments(req, incidentId)
  ];
}
