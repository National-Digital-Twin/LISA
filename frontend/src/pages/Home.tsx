// Global imports
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import { type Incident } from 'common/Incident';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useIncidents } from '../hooks';
import { Format } from '../utils';
import { PageTitle } from '../components';

function open(incident: Incident) {
  return incident.stage !== 'Closed';
}

const Home = () => {
  const theme = useTheme();
  const { incidents } = useIncidents();
  const [includeClosed, setIncludeClosed] = useState<boolean>(false);
  const navigate = useNavigate();

  const show = (incident: Incident): boolean => includeClosed || open(incident);

  const openCount = incidents?.filter(open)?.length ?? 0;
  const openCountName = openCount === 0 ? 'No' : openCount.toString();
  const closedCount = (incidents?.length ?? 0) - openCount;
  const closedCountName = closedCount === 0 ? 'None' : `+${closedCount.toString()}`;
  const title = `${openCountName} active incident${openCount === 1 ? '' : 's'}`;
  const subtitle = `(${closedCountName} closed)`;

  const onIncludeClosedChange = () => {
    setIncludeClosed((prev) => !prev);
  };

  const onAddIncident = () => {
    navigate('/createlog');
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tableHeaders = isMobile
    ? ['ID', 'Incident']
    : ['Incident ID', 'Incident name', 'Reported by', 'Date', 'Stage'];

  return (
    <div className="wrapper">
      <div className="container">
        <PageTitle title={title} subtitle={subtitle}>
          <Box
            display="flex"
            width="100%"
            sx={{
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              gap: '0.5rem'
            }}
          >
            <FormControlLabel
              label="Include closed incidents"
              htmlFor="include-closed"
              control={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Checkbox
                  disableRipple
                  disableFocusRipple
                  id="include-closed"
                  value={includeClosed}
                  onChange={onIncludeClosedChange}
                />
              }
            />
            <Box
              display="flex"
              justifyContent="end"
              sx={{
                width: {
                  xs: '100%',
                  sm: 'auto'
                }
              }}
            >
              <Button
                type="button"
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                startIcon={<AddCircleIcon />}
                disableRipple
                disableFocusRipple
                onClick={onAddIncident}
                color="primary"
              >
                Add New Incident
              </Button>
            </Box>
          </Box>
        </PageTitle>

        <TableContainer sx={{ boxShadow: 0 }} component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: 'background.default' }}>
              <TableRow>
                {tableHeaders.map((value) => (
                  <TableCell key={value} align="left">
                    <Typography variant="body1" fontWeight="600" padding={0} margin={0}>
                      {value}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents?.filter(show)?.map((incident) => {
                const { id, name, reportedBy, startedAt } = incident;
                const stage = incident.stage.toLowerCase();
                return isMobile ? (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell width="70%">
                      <Box display="flex" flexDirection="column" gap="0.3rem">
                        <Typography
                          component={Link}
                          to={`/logbook/${id}`}
                          variant="body1"
                          color="primary"
                        >
                          {name}
                        </Typography>

                        <Typography variant="body2">{reportedBy?.username}</Typography>
                        <Typography variant="body2">{Format.date(startedAt)}</Typography>

                        <Box>
                          <Chip
                            label={Format.incident.stage(incident.stage).toUpperCase()}
                            sx={{
                              minWidth: 120,
                              border: 1,
                              borderColor: `stage.${stage}.primary`,
                              backgroundColor: `stage.${stage}.secondary`
                            }}
                            variant="filled"
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>
                      <Typography
                        component={Link}
                        to={`/logbook/${id}`}
                        variant="body1"
                        color="primary"
                      >
                        {name}
                      </Typography>
                    </TableCell>
                    <TableCell>{reportedBy?.username}</TableCell>
                    <TableCell>{Format.date(startedAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={Format.incident.stage(incident.stage).toUpperCase()}
                        sx={{
                          minWidth: 120,
                          border: 1,
                          borderColor: `stage.${stage}.primary`,
                          backgroundColor: `stage.${stage}.secondary`
                        }}
                        variant="filled"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Home;
