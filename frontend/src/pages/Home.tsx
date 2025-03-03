// Global imports
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import { type Incident } from 'common/Incident';
import {
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
  Typography
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useIncidents } from '../hooks';
import { Format } from '../utils';
import { PageTitle } from '../components';

function open(incident: Incident) {
  return incident.stage !== 'Closed';
}

const Home = () => {
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

  const tableHeaders = ['Incident ID', 'Incident name', 'Reported by', 'Date', 'Stage'];

  return (
    <div className="wrapper">
      <div className="container">
        <PageTitle title={title} subtitle={subtitle}>
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
          <Button
            type="button"
            variant="contained"
            size="large"
            startIcon={<AddCircleIcon />}
            disableRipple
            disableFocusRipple
            onClick={onAddIncident}
            color="primary"
          >
            Add New Incident
          </Button>
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
              {incidents?.filter(show)?.map((inc) => {
                const stage = inc.stage.toLowerCase();
                return (
                  <TableRow key={inc.id}>
                    <TableCell>{inc.id}</TableCell>
                    <TableCell>
                      <Typography
                        component={Link}
                        to={`/logbook/${inc.id}`}
                        variant="body1"
                        color="primary"
                      >
                        {inc.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{inc.reportedBy?.username}</TableCell>
                    <TableCell>{Format.date(inc.startedAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={Format.incident.stage(inc.stage).toUpperCase()}
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
