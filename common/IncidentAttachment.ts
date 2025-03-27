// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Static, String } from 'runtypes';
import { LogEntryAttachment } from './LogEntryAttachment';
import { User } from './User';

export const IncidentAttachment = LogEntryAttachment.extend({
  logEntryId: String,
  author: User,
  uploadedAt: String,
  scanResult: String
});

// eslint-disable-next-line no-redeclare
export type IncidentAttachment = Static<typeof IncidentAttachment>;
