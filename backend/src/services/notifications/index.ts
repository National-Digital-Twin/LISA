// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import * as sparql from 'rdf-sparql-builder';

import { Notification } from 'common/Notification';
import * as ia from '../../ia';
import PubSubManager from '../../pubSub/manager';
import { literalDate, ns } from '../../rdfutil';
import { NotificationInput } from './types';
import { getCreateData, getFetchOptionals, getTypesList, parseNotification } from './utils';

export async function create(input: NotificationInput) {
  const id = randomUUID();
  const idNode = ns.data(id);
  const additionalData = getCreateData(idNode, input);

  await ia.insertData([
    [idNode, ns.rdf.type, ns.lisa(input.type)],
    [idNode, ns.lisa.hasRecipient, ns.data(input.recipient)],
    [idNode, ns.lisa.createdAt, literalDate(new Date())],
    ...additionalData
  ]);
  PubSubManager.getInstance().publish('NewNotification', input.recipient);
}

export async function markRead(req: Request, res: Response) {
  const { id } = req.params;
  const { username } = res.locals.user;
  const idNode = ns.data(id);

  const results = await ia.select({
    clause: [
      ['?id', ns.rdf.type, '?type'],
      ['?id', ns.lisa.hasRecipient, '?recipient'],
      sparql.optional([['?id', ns.lisa.readAt, '?read']])
    ],
    filters: [
      sparql.in('?recipient', [ns.data(username)]),
      sparql.in('?id', [idNode]),
      sparql.in('?type', getTypesList())
    ]
  });

  if (results.length === 1 && !results[0].read?.value) {
    await ia.insertData([[idNode, ns.lisa.readAt, literalDate(new Date())]]);
  }

  res.json({ id });
}

export async function get(req: Request, res: Response) {
  const { username } = res.locals.user;
  const optionals = getFetchOptionals();

  const results = await ia.select({
    clause: [
      ['?id', ns.rdf.type, '?type'],
      ['?id', ns.lisa.hasRecipient, '?recipient'],
      ['?id', ns.lisa.createdAt, '?createdAt'],
      ['?id', ns.lisa.hasLogEntry, '?entryId'],
      ['?id', ns.lisa.hasIncident, '?incidentId'],
      ['?entryId', ns.ies.inPeriod, '?dateTime'],
      ['?entryId', ns.lisa.hasSequence, '?sequence'],
      sparql.optional([['?id', ns.lisa.readAt, '?read']]),
      ...optionals
    ],
    filters: [sparql.in('?recipient', [ns.data(username)]), sparql.in('?type', getTypesList())],
    orderBy: [['?createdAt', 'DESC']]
  });

  const notifications: Notification[] = results.map(parseNotification);
  res.json(notifications);
}
