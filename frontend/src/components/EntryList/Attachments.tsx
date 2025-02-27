import { type LogEntry } from 'common/LogEntry';
import AttachmentLink from '../AttachmentLink';

interface Props {
  entry: LogEntry;
}
export default function Attachments({ entry }: Readonly<Props>) {
  const { attachments } = entry;

  if (!attachments) {
    return null;
  }

  return (
    <ul className="log-entry-attachments">
      <li>Attachments:</li>
      {attachments.map((attachment) => (
        <li key={attachment.name}>
          <AttachmentLink attachment={attachment} isOnServer={!entry.offline} />
        </li>
      ))}
    </ul>
  );
}
