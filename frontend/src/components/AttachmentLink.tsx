import { type IncidentAttachment } from 'common/IncidentAttachment';
import { type LogEntryAttachment } from 'common/LogEntryAttachment';
import { Box, Typography } from '@mui/material';
import { Format } from '../utils';
import { useAttachmentScanResult } from '../hooks/useAttachmentScanResult';

interface Props {
  attachment: LogEntryAttachment | IncidentAttachment;
  isOnServer?: boolean;
}

export default function AttachmentLink({ attachment, isOnServer = true }: Readonly<Props>) {
  const { scanResult } = useAttachmentScanResult(attachment.scanResult!, attachment.key!);
  if (!isOnServer) {
    return <span>{attachment.name}</span>;
  }

  const getUrl = (result: string): string => {
    if (result === 'NO_THREATS_FOUND') {
      return `/api/files/${attachment.key}/${attachment.name}?mimeType=${encodeURIComponent(attachment.mimeType ?? '')}`;
    }

    return '';
  };

  const getScanStatusDescription = (result: string): string => {
    switch (result) {
      case 'PENDING':
        return 'Scanning files for security threats. This process may take a few minutes.';
      case 'THREATS_FOUND':
        return 'This file could not be uploaded due to a security issue. Please try another file.';
      default:
        return '';
    }
  };

  return (
    <Box>
      {scanResult === 'NO_THREATS_FOUND' ? (
        <Typography
          variant="body1"
          fontWeight="bold"
          component="a"
          color="primary"
          href={getUrl(scanResult)}
          target={attachment.key}
        >
          {attachment.name}
          <span>{` (${Format.fileSize(attachment.size ?? 0)})`}</span>
        </Typography>
      ) : (
        <Typography variant="body1" fontWeight="bold" color="textDisabled">
          {attachment.name}
          <span>{` (${Format.fileSize(attachment.size ?? 0)})`}</span>
        </Typography>
      )}
      <span>{getScanStatusDescription(scanResult)}</span>
    </Box>
  );
}
