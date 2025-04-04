// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

// Local imports
import { type Coordinates } from 'common/Location';
import { LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import PubSubManager from '../../pubSub/manager';
import * as ia from '../../ia';
import { literalDate, literalDecimal, literalString, ns } from '../../rdfutil';
import { create as createNotification } from '../notifications';
import { attachments, details, fields, mentions, tasks } from './utils';

export async function create(req: Request, res: Response) {
  const { incidentId } = req.params;

  if (!incidentId) {
    res.status(400).end();
    return;
  }

  const entry = LogEntry.check(req.files?.length ? JSON.parse(req.body.logEntry) : req.body);
  const now = new Date();

  if (entry.type === 'SetIncidentInformation') {
    entry.dateTime = now.toISOString();
  }

  const entryId = randomUUID();
  entry.id = entryId;

  const entryIdNode = ns.data(entryId);
  const incidentIdNode = ns.data(incidentId);
  const authorNode = ns.data(res.locals.user.username);
  const taskId = `${entryId}-Task`;
  const taskNode = ns.data(taskId);

  const { triples: attachmentTriples, names: fileNameMappings } = await attachments.extract(
    req,
    entry,
    entryIdNode
  );
  mentions.reconcileLogFiles.file(entry, entryId, fileNameMappings);
  const userLogMentions = mentions.extractLogContent.user(entry, entryIdNode);

  const type = LogEntryTypes[entry.type];
  const content = type.noContent ? {} : entry.content ?? {}; // should probably be invalid request?

  let triples: unknown[] = [];
  try {
    triples = [
      [incidentIdNode, ns.lisa.hasLogEntry, entryIdNode],
      [entryIdNode, ns.lisa.createdAt, literalDate(now)],
      [entryIdNode, ns.rdf.type, ns.lisa(entry.type)],
      [entryIdNode, ns.lisa.contentText, literalString(content.text ?? '')],
      [entryIdNode, ns.lisa.contentJSON, literalString(content.json ?? '{}')],
      [entryIdNode, ns.ies.inPeriod, literalDate(new Date(entry.dateTime))],

      [authorNode, ns.rdf.type, ns.ies.Creator],
      [authorNode, ns.ies.hasName, literalString(res.locals.user.displayName)],
      [authorNode, ns.ies.isParticipantIn, entryIdNode],
      [entryIdNode, ns.lisa.hasSequence, entry.sequence],

      ...fields.extract(entry, entryIdNode),
      ...mentions.extractLogContent.logEntry(entry, entryIdNode),
      ...userLogMentions.map((mention) => mention.triple),
      ...attachmentTriples,
      ...tasks.extract(entry, entryIdNode, taskNode),
      ...details.extract(entry, entryIdNode)
    ];
  } catch (err) {
    throw new Error('Error creating log entry', err);
  }

  if (entry.location) {
    let coordinates: Coordinates;
    let description: string;
    if (entry.location.type === 'description' || entry.location.type === 'both') {
      description = entry.location.description;
    }
    if (entry.location.type === 'coordinates' || entry.location.type === 'both') {
      coordinates = entry.location.coordinates;
    }
    const locationIdNode = ns.data(randomUUID());
    triples.push([locationIdNode, ns.rdf.type, ns.ies.Location]);
    if (coordinates) {
      triples.push([locationIdNode, ns.ies.Latitude, literalDecimal(coordinates.latitude)]);
      triples.push([locationIdNode, ns.ies.Longitude, literalDecimal(coordinates.longitude)]);
    }
    if (description) {
      triples.push([locationIdNode, ns.lisa.hasDescription, literalString(description)]);
    }
    triples.push([entryIdNode, ns.ies.inLocation, locationIdNode]);
  }

  await ia.insertData(triples);

  userLogMentions.forEach((mention) => {
    createNotification({
      recipient: mention.username,
      type: 'UserMentionNotification',
      entryId: entry.id,
      incidentId: entry.incidentId
    });
  }); 
  
  if(entry.task?.assignee) {
    createNotification({
      recipient: entry.task.assignee.username,
      type: 'TaskAssignedNotification',
      entryId: entry.id,
      incidentId: entry.incidentId,
      taskId
    })
  }

  PubSubManager.getInstance().publish('NewLogEntries', entry.incidentId, res.locals.user.username);
  res.json({ id: entryId });
}
