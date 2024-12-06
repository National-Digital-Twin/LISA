import { type IncidentAttachment } from 'common/IncidentAttachment';
import { type LogEntryAttachment } from 'common/LogEntryAttachment';
import { type Mentionable } from 'common/Mentionable';

export function attachment(item: LogEntryAttachment | IncidentAttachment): Mentionable {
  const entryId = (item as IncidentAttachment).logEntryId;
  return {
    id: `${entryId || 'this'}::${item.name}`,
    label: item.name,
    type: 'File'
  };
}
