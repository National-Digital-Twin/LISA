// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
  const scanPendingOrQueuedMessage =
    'Scanning files for security threats. This process may take a few minutes.';

  if (!isOnServer) {
    return (
      <Box>
        <Typography variant="body1" fontWeight="bold" color="textDisabled">
          {attachment.name}
        </Typography>
        <Typography component="span">{scanPendingOrQueuedMessage}</Typography>
      </Box>
    );
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
        return scanPendingOrQueuedMessage;
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
      <Typography component="span">{getScanStatusDescription(scanResult)}</Typography>
    </Box>
  );
}
