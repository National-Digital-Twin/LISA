// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Incident } from 'common/Incident';
import { IncidentTypes } from 'common/IncidentTypes';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import {
  Box,
  Button,
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
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { QueryState } from '../components/SortFilter/filter-types';
import {
  applyImpliedSelections,
  getFromAndToFromTimeSelection
} from '../components/SortFilter/filter-utils';
import {
  buildIncidentFilters,
  incidentSort
} from '../components/SortFilter/schemas/incident-schema';
import { SortAndFilter } from '../components/SortFilter/SortAndFilter';
import Stage from '../components/Stage';
import { useIncidents } from '../hooks';
import { useResponsive } from '../hooks/useResponsiveHook';
import { Format } from '../utils';

const Incidents = () => {
  const { isMobile } = useResponsive();
  const query = useIncidents();
  const navigate = useNavigate();

  const incidents = query.data;

  const onAddIncident = () => {
    navigate('/createlog');
  };

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [queryState, setQueryState] = useState<QueryState>({
    values: {
      stage: ['active']
    },
    sort: { by: 'date_desc', direction: 'desc' }
  });

  const allAuthors = useMemo(() => {
    const seen = new Set<string>();
    return (incidents ?? [])
      .map((e) => {
        const a = e.reportedBy;
        if (!a) return null;
        const name = typeof a === 'string' ? a : (a.displayName ?? '');
        return name.trim();
      })
      .filter((name): name is string => {
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .sort((a, b) => a.localeCompare(b));
  }, [incidents]);

  const allTypes = useMemo(() => {
    if (!incidents) return [];

    const seen = new Set<string>();

    return incidents
      .reduce<{ id: string; label: string }[]>((acc, incident) => {
        const key = incident.type;
        const typeDef = key && IncidentTypes[key as keyof typeof IncidentTypes];

        if (key && typeDef && !typeDef.legacy && !seen.has(key)) {
          seen.add(key);
          acc.push({ id: key, label: typeDef.label });
        }

        return acc;
      }, [])
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [incidents]);

  const incidentFilters = useMemo(
    () => buildIncidentFilters(allTypes, allAuthors),
    [allTypes, allAuthors]
  );

  const handleOpenFilters = () => setFiltersOpen(true);

  const tableHeaders = isMobile ? ['Incident'] : ['Incident name', 'Reported by', 'Date', 'Stage'];

  const getAuthor = (e: Incident) => {
    const a = e.reportedBy;
    if (!a) return '';
    if (typeof a === 'string') return a;
    return a.displayName ?? '';
  };

  const visibleIncidents = useMemo(() => {
    if (!incidents) return [];

    const v = queryState.values;

    const selectedAuthors = new Set<string>((v.author as string[]) ?? []);
    const selectedStages = new Set<string>((v.stage as string[]) ?? []);
    const selectedTypes = new Set<string>((v.type as string[]) ?? []);

    const customTimeRange = v.timeRange as { from?: string; to?: string } | undefined;
    const preset = v.time as string | undefined;

    const { from, to } = getFromAndToFromTimeSelection(preset, customTimeRange);

    const filtered = incidents.filter((incident) => {
      const authorKey = (incident.reportedBy?.displayName ?? '').toLowerCase().replace(/\s+/g, '-');
      if (selectedAuthors.size > 0 && !selectedAuthors.has(authorKey)) return false;

      const { selected: impliedStages } = applyImpliedSelections(
        selectedStages,
        'stage',
        incidentFilters
      );

      if (impliedStages.size > 0 && !impliedStages.has(incident.stage.toLocaleLowerCase()))
        return false;

      if (selectedTypes.size > 0 && !selectedTypes.has(incident.type)) return false;

      const ts = new Date(incident.startedAt).getTime();
      if (from != null && ts < from) return false;
      if (to != null && ts > to) return false;

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const key = queryState.sort?.by;
      switch (key) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'reportedby_asc':
        case 'reportedby_desc': {
          const aa = getAuthor(a).toLowerCase();
          const bb = getAuthor(b).toLowerCase();
          return key === 'reportedby_asc' ? aa.localeCompare(bb) : bb.localeCompare(aa);
        }
        case 'date_asc':
          return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        case 'date_desc':
        default:
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
      }
    });

    return sorted;
  }, [incidentFilters, incidents, queryState.sort?.by, queryState.values]);

  return (
    <PageWrapper>
      <PageTitle title="Incidents">
        <Box display="flex" width="100%" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={onAddIncident}
            color="primary"
            sx={{ flex: 1 }}
          >
            Add New Incident
          </Button>

          <Button variant="contained" onClick={handleOpenFilters} color="primary" sx={{ flex: 1 }}>
            Sort & Filter
          </Button>
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
            {visibleIncidents.map((incident) => {
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
      <SortAndFilter
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sort={incidentSort}
        tree={incidentFilters}
        initial={queryState}
        onApply={(next) => {
          setQueryState(next);
          setFiltersOpen(false);
        }}
        onClear={() => {
          setQueryState({
            values: { stage: ['active'] },
            sort: { by: 'date_desc', direction: 'desc' }
          });
        }}
      />
    </PageWrapper>
  );
};

export default Incidents;
