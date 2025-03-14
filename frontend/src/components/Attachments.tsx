import { Link } from 'react-router-dom';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import { type IncidentAttachment } from 'common/IncidentAttachment';
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
  const theme = useTheme();

  const iconStyle = { width: 15, height: 'auto' };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        {title}
      </Typography>

      {attachments.length === 0 && (
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            p: isMobile? 2 : 3
          }}
        >
          {emptyMsg}
        </Typography>
      )}

      <Stack spacing={2}>
        {attachments
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((attachment) => (
            <Stack
              key={attachment.key}
              direction={isMobile ? 'column' : 'row'}
              spacing={isMobile? 0 : 2}
              alignItems="flex-start"
              sx={{
                width: '100%',
                gap: 2,
                backgroundColor: theme.palette.background.default,
                p: isMobile? 2 : 3
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  flexGrow: 1
                }}
              >
                <AttachmentLink attachment={attachment} />
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" >
                {!isMobile && <Icons.Person style={iconStyle} />}
                <Typography variant="body2">{Format.user(attachment.author)}</Typography>
              </Stack>

              {isMobile ? (
                <Typography variant="body2">{Format.dateAndTimeMobile(attachment.uploadedAt)}</Typography>
              ) : (
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icons.Calendar style={iconStyle} />
                    <Typography variant="body2">{Format.date(attachment.uploadedAt)}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icons.Clock style={iconStyle} />
                    <Typography variant="body2">{Format.time(attachment.uploadedAt)}</Typography>
                  </Stack>
                </>
              )}
              <Link to={`/logbook/${incidentId}#${attachment.logEntryId}`}>View log entry</Link>
            </Stack>
          ))}
      </Stack>
    </Box>
  );
}

export default Attachments;
