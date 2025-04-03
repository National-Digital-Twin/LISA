// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Array, Boolean, Optional, Record, Static, String } from 'runtypes';

// Local imports
import { nonFuture } from './constraints';
import { Field } from './Field';
import { IncidentStage } from './IncidentStage';
import { Location } from './Location';
import { LogEntryAttachment } from './LogEntryAttachment';
import { LogEntryContent } from './LogEntryContent';
import { LogEntryType } from './LogEntryType';
import { User } from './User';
import { Mentionable } from './Mentionable';
import { FieldGroup } from './FieldGroup';
import { Task } from './Task';
import { LogEntryChangeDetails } from './LogEntryChangeDetails';

export const LogEntry = Record({
  id: Optional(String), // System-generated
  incidentId: String, // Should this be a link to the Incident itself?
  dateTime: String.withConstraint(nonFuture), // User-entered, ISO-format
  createdAt: Optional(String), // system generated
  type: LogEntryType,
  content: LogEntryContent,
  fields: Optional(Array(Field)),
  groups: Optional(Array(FieldGroup)),
  location: Optional(Location), // User-entered
  author: Optional(User), // System-determined. Or should this be the user's username?
  mentionsUsers: Optional(Array(Mentionable)),
  mentionsLogEntries: Optional(Array(Mentionable)),
  mentionedByLogEntries: Optional(Array(Mentionable)),
  // recordings?: Array<string>; // Needs to be linked as multimedia,
  sequence: Optional(String), // System-generated
  stage: Optional(IncidentStage), // Only applicable to type ChangeStage
  attachments: Optional(Array(LogEntryAttachment)),
  task: Optional(Task),
  // This allows for determining if the Incident has been synced to the server during
  // offline operation.
  offline: Optional(Boolean),
  details: Optional(LogEntryChangeDetails)
});

// eslint-disable-next-line no-redeclare
export type LogEntry = Static<typeof LogEntry>;
