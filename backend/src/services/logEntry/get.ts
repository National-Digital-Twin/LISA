// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Request, Response } from 'express';

// Local imports
import { type IncidentStage } from 'common/IncidentStage';
import { type Location, type Coordinates } from 'common/Location';
import { LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
import { nodeValue } from '../../rdfutil';
import { attachments, details, fields, mentions, select, tasks } from './utils';

interface TempEntryData {
  incidentId: string;
  id: string;
  type: LogEntryType;
  content: {
    text?: string;
    json?: string;
  };
  stage?: IncidentStage;
  dateTime: string;
  createdAt?: string;
  sequence: string;
  author: {
    username?: string;
    displayName?: string;
  };
  fields: unknown;
  mentionsUsers: unknown;
  mentionedByLogEntries: unknown;
  mentionsLogEntries: unknown;
  coordinates: Coordinates[];
  locationDescription?: string;
  attachments: unknown;
  task: unknown;
  details: unknown;
}

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

  const entriesByEntryId = new Map<string, TempEntryData>();
  
  logEntryResults.forEach((row) => {
    const id = nodeValue(row.id.value);
    
    if (!entriesByEntryId.has(id)) {
      entriesByEntryId.set(id, {
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
        coordinates: [],
        locationDescription: row.locationDescription?.value,
        attachments: attachmentsByEntry[id],
        task: tasksByEntry.get(id),
        details: detailsByEntry.get(id)
      });
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
    let location: Location | undefined;
    
    if (entry.coordinates.length > 0) {
      if (entry.locationDescription) {
        location = {
          type: 'both',
          coordinates: entry.coordinates,
          description: entry.locationDescription
        } as Location;
      } else {
        location = {
          type: 'coordinates',
          coordinates: entry.coordinates
        } as Location;
      }
    } else if (entry.locationDescription) {
      location = {
        type: 'description',
        description: entry.locationDescription
      } as Location;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { coordinates: _coordinates, locationDescription: _locationDescription, ...entryWithoutTempProps } = entry;
    return {
      ...entryWithoutTempProps,
      location
    } as LogEntry;
  });

  res.json(entries);
}
