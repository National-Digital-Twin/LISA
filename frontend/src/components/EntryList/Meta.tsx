// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid2 as Grid } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Format } from '../../utils';

const Meta = ({
  entry,
  isMobile,
  isBelowMd,
  metaItems = undefined
}: {
  entry: LogEntry;
  isMobile: boolean;
  isBelowMd: boolean;
  metaItems?: ReactElement[];
}) => {
  const hasMetaItems = Array.isArray(metaItems) && metaItems.length > 0;

  if (isMobile) {
    return (
      <Grid
        container
        wrap="nowrap"
        width="100%"
        pl={1}
        pr={hasMetaItems ? 0 : 1.5}
        paddingY={0.5}
        gap={hasMetaItems ? 1 : 4}
      >
        <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="grow">
          <Typography variant="body2" color="white">
            {Format.entry.type(entry.type)}
          </Typography>
        </Grid>
        <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="auto">
          <Typography variant="body2" color="white">
            {Format.date(entry.dateTime)} | {Format.time(entry.dateTime)}
          </Typography>
        </Grid>

        {!isBelowMd && (
          <>
            <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="auto">
              <Typography variant="body1" color="white">
                {Format.date(entry.dateTime)}
              </Typography>
            </Grid>
            <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="auto">
              <WatchLaterIcon fontSize="small" />
              <Typography variant="body1" color="white">
                {Format.time(entry.dateTime)}
              </Typography>
            </Grid>
          </>
        )}

        {metaItems?.map((item) => (
          <Grid key={item.key} display="flex" alignItems="center" size="auto">
            {item}
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid
      container
      wrap="nowrap"
      width="100%"
      paddingX={hasMetaItems ? 1 : 2}
      paddingY={1}
      gap={hasMetaItems ? 1 : 4}
    >
      <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="grow">
        <SellIcon fontSize="small" />
        <Typography variant="body1" color="white">
          {Format.entry.type(entry.type)}
        </Typography>
      </Grid>

      {!isBelowMd && (
        <>
          <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="auto">
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body1" color="white">
              {Format.date(entry.dateTime)}
            </Typography>
          </Grid>
          <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="auto">
            <WatchLaterIcon fontSize="small" />
            <Typography variant="body1" color="white">
              {Format.time(entry.dateTime)}
            </Typography>
          </Grid>
        </>
      )}

      <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="auto">
        <PersonIcon fontSize="small" />
        <Typography variant="body1" color="white">
          {Format.user(entry.author)}
        </Typography>
      </Grid>

      <Grid
        component="div"
        sx={{ display: 'flex', alignItems: 'center' }}
        size="auto"
        title={entry.offline ? 'Offline entry' : ''}
      >
        <Typography
          component={Link}
          to={`#${entry.id}`}
          variant="body1"
          sx={{ color: 'white !important', ml: 'auto' }}
        >
          {entry.offline ? 'Submitting' : `#${entry.sequence}`}
        </Typography>
      </Grid>

      {metaItems?.map((item) => (
        <Grid key={item.key} display="flex" alignItems="center" size="auto">
          {item}
        </Grid>
      ))}
    </Grid>
  );
};

export default Meta;
