import { Static, String } from 'runtypes';
import { LogEntryAttachment } from './LogEntryAttachment';
import { User } from './User';

export const IncidentAttachment = LogEntryAttachment.extend({
  logEntryId: String,
  author: User,
  uploadedAt: String,
});

// eslint-disable-next-line no-redeclare
export type IncidentAttachment = Static<typeof IncidentAttachment>;
