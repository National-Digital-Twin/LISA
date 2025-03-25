import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Button, Popover, Typography } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUser = Boolean(anchorEl);

  const OFFLINE_MESSAGE =
    'This entry is only held offline. It will be synchronised when you connect to a network.';
  const prefix = entry.offline ? 'OFF-' : '#';

  const hasMetaItems = Array.isArray(metaItems) && metaItems.length > 0;

  return (
    <Grid
      container
      wrap="nowrap"
      width="100%"
      paddingX={hasMetaItems && isMobile ? 1 : 2}
      paddingY={1}
      gap={hasMetaItems && isMobile ? 1 : 4}
    >
      <Grid
        component="div"
        sx={{ display: 'flex', alignItems: 'center' }}
        size="auto"
        title={entry.offline ? OFFLINE_MESSAGE : ''}
      >
        <Typography
          component={Link}
          to={`#${entry.id}`}
          variant="body1"
          sx={{ color: 'white !important' }}
        >
          {prefix}
          {entry.sequence?.toString()}
        </Typography>
      </Grid>
      <Grid display="flex" flexDirection="row" alignItems="center" gap={1} size="grow">
        <SellIcon fontSize="small" />
        <Typography variant="body1" color="white">
          {Format.entry.type(entry.type)}
        </Typography>
      </Grid>
      <Grid
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={isMobile ? 'flex-end' : 'flex-start'}
        gap={1}
        size="auto"
      >
        {!isMobile ? (
          <>
            <PersonIcon fontSize="small" />
            <Typography variant="body1" color="white">
              {Format.user(entry.author)}
            </Typography>
          </>
        ) : (
          <>
            <Button
              variant="text"
              sx={{ color: 'white' }}
              onClick={(event) => setAnchorEl(event.currentTarget)}
              startIcon={<PersonIcon fontSize="small" />}
            >
              {Format.userInitials(entry.author)}
            </Button>
            <Popover
              open={openUser}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              slotProps={{
                paper: {
                  sx: { padding: '1rem' }
                }
              }}
            >
              <Typography fontSize="1.15rem">{Format.user(entry.author)}</Typography>
            </Popover>
          </>
        )}
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
      {metaItems?.map((item) => (
        <Grid key={item.key} display="flex" alignItems="center" size="auto">
          {item}
        </Grid>
      ))}
    </Grid>
  );
};

export default Meta;
