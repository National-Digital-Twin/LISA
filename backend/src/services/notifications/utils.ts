// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import * as sparql from 'rdf-sparql-builder';

import { NotificationType, TaskAssignedNotification, UserMentionNotification, type Notification } from 'common/Notification';
import { type NotificationInput } from './types';
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
      [idNode, ns.lisa.hasLogEntry, logEntryIdNode],
      [idNode, ns.lisa.hasIncident, ns.data(input.incidentId)],
      [idNode, ns.lisa.hasTask, ns.data(input.taskId)]
    ];
  
  default:
    return [];
  }
}

export function getFetchOptionals(): unknown[] {
  return [
    // user mention
    sparql.optional([
      ['?entryId', ns.lisa.contentText, '?contentText'],
      ['?author', ns.ies.isParticipantIn, '?entryId'],
      ['?author', ns.ies.hasName, '?authorName']
    ]),
    sparql.optional([
      ['?id', ns.lisa.hasTask, '?taskId'],
      ['?taskId', ns.ies.hasName, '?taskName']
    ])
  ];
}

function getUserMentionNotification(id : string, type : NotificationType, recipient : string, dateTime : string, read : boolean, row : ResultRow) 
: UserMentionNotification {
  return {
    id,
    type,
    recipient,
    dateTime,
    read,
    entry: {
      id: nodeValue(row.entryId.value),
      incidentId: nodeValue(row.incidentId.value),
      dateTime: row.dateTime.value,
      sequence: row.sequence.value,
      content: {
        text: row.contentText?.value
      },
      author: {
        username: row.authorName?.value,
        displayName: row.authorName?.value
      }
    }
  } as UserMentionNotification;
}

function getTaskAssignedNotification(id : string, type : NotificationType, recipient : string, dateTime : string, read : boolean, row : ResultRow)
: TaskAssignedNotification {
  return {
    id,
    type,
    recipient,
    dateTime,
    read,
    entry: {
      id: nodeValue(row.entryId.value),
      incidentId: nodeValue(row.incidentId.value),
      dateTime: row.dateTime.value,
      sequence: row.sequence.value,
      author: {
        username: row.authorName?.value,
        displayName: row.authorName?.value
      },
      task: {
        id: nodeValue(row.taskId.value),
        name: row.taskName.value
      }
    }
  } as TaskAssignedNotification;
}

export function parseNotification(row: ResultRow): Notification {
  const id = nodeValue(row.id.value);
  const type = nodeValue(row.type.value) as NotificationType;
  const recipient = row.recipient.value;
  const dateTime = row.createdAt.value;
  const read = row.read?.value !== undefined;

  switch (type) {
  case 'UserMentionNotification':
    return getUserMentionNotification(id, type, recipient, dateTime, read, row);

  case 'TaskAssignedNotification':
    return getTaskAssignedNotification(id, type, recipient, dateTime, read, row);

  default:
    throw new ApplicationError(`unknown notification type ${type} could not be parsed`);
  }
}

