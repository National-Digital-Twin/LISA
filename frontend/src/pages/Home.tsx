// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import { type Incident } from 'common/Incident';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useIncidents } from '../hooks';
import { Format } from '../utils';
import { PageTitle } from '../components';
import Stage from '../components/Stage';
import PageWrapper from '../components/PageWrapper';
import { useResponsive } from '../hooks/useResponsiveHook';

function open(incident: Incident) {
  return incident.stage !== 'Closed';
}

const Home = () => {
  const { isMobile } = useResponsive();
  const query = useIncidents();
  const [includeClosed, setIncludeClosed] = useState<boolean>(false);
  const navigate = useNavigate();

  const show = (incident: Incident): boolean => includeClosed || open(incident);

  const incidents = query.data;
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

  const tableHeaders = isMobile ? ['Incident'] : ['Incident name', 'Reported by', 'Date', 'Stage'];

  return (
    <PageWrapper>
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
              <Checkbox
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
              return isMobile ? (
                <TableRow key={id}>
                  <TableCell width="70%">
                    <Box display="flex" flexDirection="column" gap="0.3rem">
                      <Typography
                        component={Link}
                        to={`/logbook/${id}`}
                        variant="body1"
                        color="primary"
                        fontWeight="bold"
                      >
                        {name}
                      </Typography>

                      <Typography variant="body2">{reportedBy?.username}</Typography>
                      <Typography variant="body2">{Format.date(startedAt)}</Typography>

                      <Box>
                        <Stage
                          label={Format.incident.stage(incident.stage).toUpperCase()}
                          stage={incident.stage}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={id}>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/logbook/${id}`}
                      variant="body1"
                      color="primary"
                      fontWeight="bold"
                    >
                      {name}
                    </Typography>
                  </TableCell>
                  <TableCell>{reportedBy?.username}</TableCell>
                  <TableCell>{Format.date(startedAt)}</TableCell>
                  <TableCell>
                    <Stage
                      label={Format.incident.stage(incident.stage).toUpperCase()}
                      stage={incident.stage}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
};

export default Home;
