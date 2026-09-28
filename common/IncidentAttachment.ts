// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Static, String } from 'runtypes';
import { Attachment } from './Attachment';
import { User } from './User';

export const IncidentAttachment = Attachment.extend({
  logEntryId: String,
  author: User,
  uploadedAt: String,
  scanResult: String
});

export type IncidentAttachment = Static<typeof IncidentAttachment>;
