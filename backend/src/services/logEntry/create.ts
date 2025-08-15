// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

// Local imports
import { LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import PubSubManager from '../../pubSub/manager';
import * as ia from '../../ia';
import { literalDate, literalString, ns } from '../../rdfutil';
import { create as createNotification } from '../notifications';
import { details, fields, mentions } from './utils';
import { extractAttachments } from '../common/attachments';
import { addLocationTriples } from '../common/location';


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

  const entryId = entry.id ?? randomUUID();
  const entryIdNode = ns.data(entryId);
  const incidentIdNode = ns.data(incidentId);
  const authorNode = ns.data(res.locals.user.username);

  const { triples: attachmentTriples, names: fileNameMappings } = await extractAttachments(
    req,
    entry.attachments,
    entryId,
    entryIdNode
  );
  mentions.reconcileLogFiles.file(entry, entryId, fileNameMappings);
  const userLogMentions = mentions.extractLogContent.user(entry, entryIdNode);

  const type = LogEntryTypes[entry.type];
  const content = type.noContent ? {} : (entry.content ?? {}); // should probably be invalid request?

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

      ...details.extract(entry, entryIdNode)
    ];
  } catch (err) {
    throw new Error('Error creating log entry', { cause: err });
  }

  if (entry.location) {
    triples.push(...addLocationTriples(entry.location, entryIdNode));
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

  PubSubManager.getInstance().publish('NewLogEntries', entry.incidentId, res.locals.user.username);
  res.json({ id: entryId });
}
