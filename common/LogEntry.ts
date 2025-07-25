// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Array, Boolean, Object, type Static, String } from 'runtypes';

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

export const LogEntry = Object({
  id: String.optional(), // System-generated
  incidentId: String, // Should this be a link to the Incident itself?
  dateTime: String.withConstraint(nonFuture), // User-entered, ISO-format
  createdAt: String.optional(), // system generated
  type: LogEntryType,
  content: LogEntryContent,
  fields: Array(Field).optional(),
  groups: Array(FieldGroup).optional(),
  location: Location.optional(), // User-entered
  author: User.optional(), // System-determined. Or should this be the user's username?
  mentionsUsers: Array(Mentionable).optional(),
  mentionsLogEntries: Array(Mentionable).optional(),
  mentionedByLogEntries: Array(Mentionable).optional(),
  // recordings?: Array<string>; // Needs to be linked as multimedia,
  sequence: String.optional(), // System-generated
  stage: IncidentStage.optional(), // Only applicable to type ChangeStage
  attachments: Array(LogEntryAttachment).optional(),
  task: Task.optional(),
  // This allows for determining if the Incident has been synced to the server during
  // offline operation.
  offline: Boolean.optional(),
  details: LogEntryChangeDetails.optional()
});

export type LogEntry = Static<typeof LogEntry>;
