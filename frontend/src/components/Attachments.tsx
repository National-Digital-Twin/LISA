import { Link } from 'react-router-dom';

import { type IncidentAttachment } from 'common/IncidentAttachment';
import { Box } from '@mui/material';
import { Format, Icons } from '../utils';
import AttachmentLink from './AttachmentLink';
import { useResponsive } from '../hooks/useResponsiveHook';

interface Props {
  incidentId: string;
  attachments: IncidentAttachment[];
  title: string;
  emptyMsg: string;
}

function Attachments({ incidentId, attachments, title, emptyMsg }: Readonly<Props>) {
  const { isMobile } = useResponsive();
  return (
    <Box className="incident-attachments">
      <h2>{title}</h2>
      {attachments.length === 0 && <span className="attachment-row-empty">{emptyMsg}</span>}
      {attachments
        .toSorted((a, b) => a.name.localeCompare(b.name))
        .map((attachment) => (
          <div key={attachment.key} className="attachment-row" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <div>
              <AttachmentLink attachment={attachment} />
            </div>
            <div>
              {!isMobile && <Icons.Person />}
              {Format.user(attachment.author)}
            </div>
            {isMobile && <div>{Format.dateMobile(attachment.uploadedAt)}</div>}
            {!isMobile && <>
              <div>
                <Icons.Calendar />
                {Format.date(attachment.uploadedAt)}
              </div>
              <div>
                <Icons.Clock />
                {Format.time(attachment.uploadedAt)}
              </div>
            </>
            }
            <div>
              <Link to={`/logbook/${incidentId}#${attachment.logEntryId}`}>View log entry</Link>
            </div>
          </div>
        ))}
    </Box>
  );
}

export default Attachments;
