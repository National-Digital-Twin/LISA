// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';

import { type IncidentStage } from 'common/IncidentStage';
import { type Coordinates } from 'common/Location';
import { LogEntry, type LogEntry as LogEntryType } from 'common/LogEntry';
import { type LogEntryType as LogEntryTypeEnum } from 'common/LogEntryType';
import { nodeValue } from '../../rdfutil';
import { details, fields, mentions, select } from './utils';
import { parseAttachments } from '../common/attachments';
import { buildLocation } from '../common/location';

type TempEntryData = Omit<LogEntryType, 'location'> & {
  coordinates: Coordinates[];
  locationDescription?: string;
};


export async function get(req: Request, res: Response) {
  const { incidentId } = req.params;

  if (!incidentId) {
    res.status(400).end();
    return;
  }

  const [
    logEntryResults,
    fieldResults,
    mentionedByResults,
    mentionsResults,
    mentionsUsersResults,
    attachmentResults,
    detailResults
  ] = await Promise.all(select(incidentId));

  const fieldResultsByEntry = fields.parse(fieldResults);
  const mentionsLogEntriesByEntry = mentions.parse.logEntry(mentionsResults, false);
  const mentionedByLogEntriesByEntry = mentions.parse.logEntry(mentionedByResults, true);
  const mentionedUsersByEntry = mentions.parse.user(mentionsUsersResults);
  const attachmentsByEntry = await parseAttachments(attachmentResults, 'entryId');
  const detailsByEntry = await details.parse(detailResults);

  const entriesByEntryId = new Map<string, TempEntryData>();

  logEntryResults.forEach((row) => {
    const id = nodeValue(row.id.value);

    if (!entriesByEntryId.has(id)) {
      const entry: TempEntryData = {
        incidentId,
        id,
        type: nodeValue(row.type.value) as LogEntryTypeEnum,
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
        coordinates: [],
        locationDescription: row.locationDescription?.value,
        attachments: attachmentsByEntry[id],
        details: detailsByEntry.get(id)
      };

      entriesByEntryId.set(id, entry);
    }

    if (row.locationId && row.latitude && row.longitude) {
      const entry = entriesByEntryId.get(id);
      entry.coordinates.push({
        latitude: Number(row.latitude.value),
        longitude: Number(row.longitude.value)
      });
    }
  });

  const entries = Array.from(entriesByEntryId.values()).map((entry) => {
    const location = buildLocation(entry.coordinates, entry.locationDescription) || undefined;

    // Remove temporary properties and add final location
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { coordinates: _coordinates, locationDescription: _locationDescription, ...entryWithoutTempProps } = entry;
    return {
      ...entryWithoutTempProps,
      location
    } as LogEntry;
  });

  res.json(entries);
}
