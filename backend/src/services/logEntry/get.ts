// Global imports
import { Request, Response } from 'express';

// Local imports
import { type IncidentStage } from 'common/IncidentStage';
import { type Location } from 'common/Location';
import { LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
import { nodeValue } from '../../rdfutil';
import { attachments, fields, mentions, select } from './utils';

export async function get(req: Request, res: Response) {
  const { incidentId } = req.params;

  if (!incidentId) {
    res.status(404).end();
    return;
  }

  const [
    logEntryResults,
    fieldResults,
    mentionedByResults,
    mentionsResults,
    mentionsUsersResults,
    attachmentResults
  ] = await Promise.all(select(req, incidentId));

  /**
   * Make maps of the repeating rows for each entry id
   */
  const fieldResultsByEntry = fields.parse(fieldResults);
  const mentionsLogEntriesByEntry = mentions.parse.logEntry(mentionsResults, false);
  const mentionedByLogEntriesByEntry = mentions.parse.logEntry(mentionedByResults, true);
  const mentionedUsersByEntry = mentions.parse.user(mentionsUsersResults);
  const attachmentsByEntry = attachments.parse(attachmentResults);

  const entries = logEntryResults.map((row) => {
    const id = nodeValue(row.id.value);
    return {
      incidentId,
      id,
      type: nodeValue(row.type.value) as LogEntryType,
      content: {
        text: row.contentText?.value,
        json: row.contentJSON?.value
      },
      stage: (row.stage?.value ?? undefined) as IncidentStage,
      dateTime: row.dateTime.value,
      createdAt: row.createdAt?.value,
      author: {
        username: row.authorName?.value ?? undefined,
        displayName: row.authorName?.value ?? undefined
      },
      fields: fieldResultsByEntry[id],
      mentionsUsers: mentionedUsersByEntry[id],
      mentionedByLogEntries: mentionedByLogEntriesByEntry[id],
      mentionsLogEntries: mentionsLogEntriesByEntry[id],
      location: row.locationId
        ? {
          coordinates: row.latitude
            ? {
              latitude: Number(row.latitude.value),
              longitude: Number(row.longitude.value)
            }
            : undefined,
          description: row.locationDescription?.value
        } as Location
        : undefined,
      attachments: attachmentsByEntry[id],
    } satisfies LogEntry;
  });

  res.json(entries);
}
