import { Link } from 'react-router-dom';

import { type IncidentAttachment } from 'common/IncidentAttachment';
import { Format, Icons } from '../utils';
import AttachmentLink from './AttachmentLink';

interface Props {
  incidentId: string;
  attachments: IncidentAttachment[];
  title: string;
  emptyMsg: string;
}

function Attachments({ incidentId, attachments, title, emptyMsg }: Props) {
  return (
    <div className="incident-attachments">
      <h2>{title}</h2>
      {attachments.length === 0 && (
        <span>{emptyMsg}</span>
      )}
      {attachments.sort((a, b) => a.name.localeCompare(b.name)).map((attachment) => (
        <div key={attachment.key} className="attachment-row">
          <div>
            <AttachmentLink attachment={attachment} />
          </div>
          <div>
            <Icons.Person />
            {Format.user(attachment.author)}
          </div>
          <div>
            <Icons.Calendar />
            {Format.date(attachment.uploadedAt)}
          </div>
          <div>
            <Icons.Clock />
            {Format.time(attachment.uploadedAt)}
          </div>
          <div>
            <Link to={`/logbook/${incidentId}#${attachment.logEntryId}`}>View log entry</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Attachments;
