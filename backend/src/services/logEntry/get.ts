// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';

import { type IncidentStage } from 'common/IncidentStage';
import { type Coordinates, type Location } from 'common/Location';
import { LogEntry, type LogEntry as LogEntryType } from 'common/LogEntry';
import { type LogEntryTypeV2 as LogEntryTypeEnum } from 'common/LogEntryType';
import { nodeValue } from '../../rdfutil';
import { attachments, details, fields, mentions, select, tasks } from './utils';

type TempEntryData = Omit<LogEntryType, 'location'> & {
  coordinates: Coordinates[];
  locationDescription?: string;
};

function buildLocation(
  coordinates: Coordinates[],
  locationDescription?: string
): Location | undefined {
  if (coordinates.length > 0) {
    if (locationDescription) {
      return {
        type: 'both',
        coordinates,
        description: locationDescription
      } as Location;
    }
    return {
      type: 'coordinates',
      coordinates
    } as Location;
  }
  if (locationDescription) {
    return {
      type: 'description',
      description: locationDescription
    } as Location;
  }
  return undefined;
}

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
    taskResults,
    detailResults
  ] = await Promise.all(select(incidentId));

  const fieldResultsByEntry = fields.parse(fieldResults);
  const mentionsLogEntriesByEntry = mentions.parse.logEntry(mentionsResults, false);
  const mentionedByLogEntriesByEntry = mentions.parse.logEntry(mentionedByResults, true);
  const mentionedUsersByEntry = mentions.parse.user(mentionsUsersResults);
  const attachmentsByEntry = await attachments.parse(attachmentResults);
  const detailsByEntry = await details.parse(detailResults);
  const tasksByEntry = await tasks.parse(taskResults);

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
        task: tasksByEntry.get(id),
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
    const location = buildLocation(entry.coordinates, entry.locationDescription);

    // Remove temporary properties and add final location
     
    const {
      //  eslint-disable-next-line @typescript-eslint/no-unused-vars 
      coordinates: _coordinates,
      //  eslint-disable-next-line @typescript-eslint/no-unused-vars 
      locationDescription: _locationDescription,
      ...entryWithoutTempProps
    } = entry;
    return {
      ...entryWithoutTempProps,
      location
    } as LogEntry;
  });

  res.json(entries);
}
