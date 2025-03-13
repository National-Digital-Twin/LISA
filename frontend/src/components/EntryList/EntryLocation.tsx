// Global imports
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Format } from '../../utils';

interface Props {
  entry: LogEntry;
}

export default function EntryLocation({ entry }: Readonly<Props>) {
  const link = useMemo(() => Format.entry.locationLink(entry), [entry]);

  if (!entry.location) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="row" component="ul" gap={0.5}>
      <Typography component="li" variant="body1" fontWeight="bold">
        Location:
      </Typography>
      {link ? (
        <Typography component={Link} to={link} variant="body1" fontWeight={600}>
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
