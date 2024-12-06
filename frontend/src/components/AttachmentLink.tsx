import { type IncidentAttachment } from 'common/IncidentAttachment';
import { type LogEntryAttachment } from 'common/LogEntryAttachment';
import { Format } from '../utils';

interface Props {
  attachment: LogEntryAttachment | IncidentAttachment;
  isOnServer?: boolean;
}

export default function AttachmentLink({ attachment, isOnServer = true }: Props) {
  if (!isOnServer) {
    return <span>{attachment.name}</span>;
  }
  const url = `/api/files/${attachment.key}/${attachment.name}?mimeType=${encodeURIComponent(attachment.mimeType || '')}`;
  return (
    <a href={url} target={attachment.key}>
      {attachment.name}
      <span>{` (${Format.fileSize(attachment.size || 0)})`}</span>
    </a>
  );
}
