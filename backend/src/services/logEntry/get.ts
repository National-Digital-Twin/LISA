// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Request, Response } from 'express';

// Local imports
import { type IncidentStage } from 'common/IncidentStage';
import { type Location } from 'common/Location';
import { LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
import { nodeValue } from '../../rdfutil';
import { attachments, details, fields, mentions, select, tasks } from './utils';

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
    attachmentResults,
    taskResults,
    detailResults
  ] = await Promise.all(select(incidentId));

  /**
   * Make maps of the repeating rows for each entry id
   */
  const fieldResultsByEntry = fields.parse(fieldResults);
  const mentionsLogEntriesByEntry = mentions.parse.logEntry(mentionsResults, false);
  const mentionedByLogEntriesByEntry = mentions.parse.logEntry(mentionedByResults, true);
  const mentionedUsersByEntry = mentions.parse.user(mentionsUsersResults);
  const attachmentsByEntry = await attachments.parse(attachmentResults);
  const detailsByEntry = await details.parse(detailResults);

  const tasksByEntry = await tasks.parse(taskResults);

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
      sequence: row.sequence.value,
      author: {
        username: row.authorName?.value ?? undefined,
        displayName: row.authorName?.value ?? undefined
      },
      fields: fieldResultsByEntry[id],
      mentionsUsers: mentionedUsersByEntry[id],
      mentionedByLogEntries: mentionedByLogEntriesByEntry[id],
      mentionsLogEntries: mentionsLogEntriesByEntry[id],
      /* eslint-disable indent */
      location: row.locationId
        ? ({
            coordinates: row.latitude
              ? {
                  latitude: Number(row.latitude.value),
                  longitude: Number(row.longitude.value)
                }
              : undefined,
            description: row.locationDescription?.value
          } as Location)
        : undefined,
      /* eslint-enable */
      attachments: attachmentsByEntry[id],
      task: tasksByEntry.get(id),
      details: detailsByEntry.get(id)
    } satisfies LogEntry;
  });

  res.json(entries);
}
