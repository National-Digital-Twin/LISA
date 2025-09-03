// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { type Location as LocationUnion } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';

// Local imports
import { Format } from '../../utils';
import { hasPlottableCoordinates } from '../../utils/Format/entry/locationLink';

interface Props {
  entry: LogEntry;
}

export default function EntryLocation({ entry }: Readonly<Props>) {
  const displayLink = hasPlottableCoordinates(entry.location as LocationUnion | null | undefined);
  const link = "/location"

  if (!entry.location) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="row" component="ul" gap={0.5}>
      <Typography component="li" variant="body1" fontWeight="bold">
        Location:
      </Typography>
      {displayLink ? (
        <Typography component={Link} to={link} state={entry} variant="body1" fontWeight={600}>
          {Format.entry.location(entry)}
        </Typography>
      ) : (
        <Typography component="li" variant="body1">
          {Format.entry.location(entry)}
        </Typography>
      )}
    </Box>
  );
}
