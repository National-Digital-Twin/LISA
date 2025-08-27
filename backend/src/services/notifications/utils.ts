// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import * as sparql from 'rdf-sparql-builder';

import {
  NotificationType,
  TaskAssignedNotification,
  UserMentionNotification,
  type Notification
} from 'common/Notification';
import { ExtractNotification, type NotificationInput } from './types';
import { ResultRow } from '../../ia';
import { nodeValue, ns } from '../../rdfutil';
import { ApplicationError } from '../../errors';

export function getTypesList(): unknown {
  return [ns.lisa('UserMentionNotification'), ns.lisa('TaskAssignedNotification')];
}

export function getCreateData(idNode: unknown, input: NotificationInput): unknown[] {
  const logEntryIdNode = ns.data(input.entryId);

  switch (input.type) {
    case 'UserMentionNotification':
      return [
        [idNode, ns.lisa.hasLogEntry, logEntryIdNode],
        [idNode, ns.lisa.hasIncident, ns.data(input.incidentId)]
      ];

    case 'TaskAssignedNotification':
      return [
        [idNode, ns.lisa.hasIncident, ns.data(input.incidentId)],
        [idNode, ns.lisa.hasTask, ns.data(input.taskId)]
      ];

    default:
      return [];
  }
}

export function getFetchOptionals(): unknown[] {
  return [
    sparql.optional([['?incidentId', ns.ies.hasName, '?incidentName']]),

    // user mention
    sparql.optional([
      ['?id', ns.rdf.type, ns.lisa('UserMentionNotification')],
      ['?id', ns.lisa.hasLogEntry, '?entryId'],
      ['?entryId', ns.ies.inPeriod, '?dateTime']
    ]),
    sparql.optional([
      ['?id', ns.rdf.type, ns.lisa('UserMentionNotification')],
      ['?id', ns.lisa.hasLogEntry, '?entryId'],
      ['?author', ns.ies.isParticipantIn, '?entryId'],
      ['?author', ns.ies.hasName, '?authorName']
    ]),

    // task assigned
    sparql.optional([
      ['?id', ns.rdf.type, ns.lisa('TaskAssignedNotification')],
      ['?id', ns.lisa.hasTask, '?taskId'],
      ['?taskId', ns.ies.hasName, '?taskName'],
      ['?taskAuthor', ns.ies.isParticipantIn, '?taskId'],
      ['?taskAuthor', ns.rdf.type, ns.ies.Creator],
      ['?taskAuthor', ns.ies.hasName, '?taskAuthorName']
    ])
  ];
}

function getUserMentionNotification(
  extract: ExtractNotification
): UserMentionNotification {
  const { id, type, recipient, dateTime, read, seen, incidentTitle, row } = extract;

  return {
    id,
    type,
    recipient,
    dateTime,
    read,
    seen,
    incidentTitle,
    entry: {
      id: nodeValue(row.entryId.value),
      incidentId: nodeValue(row.incidentId.value),
      author: {
        username: row.authorName?.value,
        displayName: row.authorName?.value
      }
    }
  } as UserMentionNotification;
}

function getTaskAssignedNotification(
  extract: ExtractNotification
): TaskAssignedNotification {
  const { id, type, recipient, dateTime, read, seen, incidentTitle, row } = extract;

  return {
    id,
    type,
    recipient,
    dateTime,
    read,
    seen,
    incidentTitle,
    task: {
      id: nodeValue(row.taskId.value),
      name: row.taskName.value,
      author: {
        username: row.taskAuthorName?.value,
        displayName: row.taskAuthorName?.value
      },
      incidentId: nodeValue(row.incidentId.value)
    }
  } as TaskAssignedNotification;
}

export function parseNotification(row: ResultRow): Notification {
  const read = row.read?.value !== undefined
  const extract: ExtractNotification = {
    id: nodeValue(row.id.value),
    type: nodeValue(row.type.value) as NotificationType,
    recipient: row.recipient.value,
    dateTime: row.createdAt.value,
    read,
    seen: row.seen?.value !== undefined || read,
    incidentTitle: row.incidentName.value,
    row,
  };

  switch (extract.type) {
    case 'UserMentionNotification':
      return getUserMentionNotification(extract);

    case 'TaskAssignedNotification':
      return getTaskAssignedNotification(extract);

    default:
      throw new ApplicationError(`unknown notification type ${extract.type} could not be parsed`);
  }
}
