import * as sparql from 'rdf-sparql-builder';

import { NotificationType, UserMentionNotification, type Notification } from 'common/Notification';
import { type UserMentionInput } from './types';
import { ResultRow } from '../../ia';
import { nodeValue, ns } from '../../rdfutil';
import { ApplicationError } from '../../errors';

export function getTypesList(): unknown {
  return [ns.lisa('UserMentionNotification')];
}

export function getCreateData(idNode: unknown, input: UserMentionInput): unknown[] {
  if (input.type === 'UserMentionNotification') {
    return [
      [idNode, ns.lisa.hasLogEntry, ns.data(input.entryId)],
      [idNode, ns.lisa.hasIncident, ns.data(input.incidentId)]
    ];
  }
  return [];
}

export function getFetchOptionals(): unknown[] {
  return [
    // user mention
    sparql.optional([
      ['?entryId', ns.lisa.contentText, '?contentText'],
      ['?author', ns.ies.isParticipantIn, '?entryId'],
      ['?author', ns.ies.hasName, '?authorName']
    ])
  ];
}

export function parseNotification(row: ResultRow): Notification {
  const id = nodeValue(row.id.value);
  const type = nodeValue(row.type.value) as NotificationType;
  const recipient = row.recipient.value;
  const dateTime = row.createdAt.value;
  const read = row.read?.value !== undefined;

  if (type === 'UserMentionNotification') {
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
  throw new ApplicationError(`unknown notification type ${type} could not be parsed`);
}
