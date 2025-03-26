import { type LogEntry } from 'common/LogEntry';
import { Box, Typography } from '@mui/material';
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
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={0.5}>
      <Typography component="li" variant="body1" fontWeight="bold">
        Attachments:
      </Typography>
      {attachments.map((attachment) => (
        <Box displayPrint="none" key={attachment.key}>
          <AttachmentLink attachment={attachment} isOnServer={!entry.offline} />
        </Box>
      ))}
    </Box>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
