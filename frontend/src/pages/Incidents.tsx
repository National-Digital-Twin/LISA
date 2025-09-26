// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Incident } from 'common/Incident';
import { IncidentTypes } from 'common/IncidentTypes';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Local imports
import {
  Box,
  Button,
  Typography
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { PageTitle } from '../components';
import DataList, { ListRow } from '../components/DataList';
import StageMini from '../components/Stage/StageMini';
import PageWrapper from '../components/PageWrapper';
import { QueryState } from '../components/SortFilter/filter-types';
import {
  applyImpliedSelections,
  countActive,
  getFromAndToFromTimeSelection
} from '../components/SortFilter/filter-utils';
import {
  buildIncidentFilters,
  incidentSort
} from '../components/SortFilter/schemas/incident-schema';
import { SortAndFilter } from '../components/SortFilter/SortAndFilter';
import { useIncidents, useAuth } from '../hooks';
import { Format } from '../utils';
import { isAdmin } from '../utils/userRoles';

interface IncidentsProps {
  isManaging?: boolean;
}

const Incidents = ({ isManaging = false }: Readonly<IncidentsProps>) => {
  const query = useIncidents();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isManaging && !isAdmin(user.current)) {
      navigate('/incidents');
    }
  }, [isManaging, user.current, navigate]);

  const incidents = query.data;

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

  const getAuthor = (e: Incident) => {
    const a = e.reportedBy;
    if (!a) return '';
    if (typeof a === 'string') return a;
    return a.displayName ?? '';
  };

  const activeFilterCount = useMemo(() => countActive(queryState.values), [queryState.values]);

  const visibleIncidents = useMemo(() => {
    if (!incidents) return [];

    const v = queryState.values;

    const searchTerm = ((v.search as string) ?? '').trim().toLowerCase();

    const selectedAuthors = new Set<string>((v.author as string[]) ?? []);
    const selectedStages = new Set<string>((v.stage as string[]) ?? []);
    const selectedTypes = new Set<string>((v.type as string[]) ?? []);

    const customTimeRange = v.timeRange as { from?: string; to?: string } | undefined;
    const preset = v.time as string | undefined;

    const { from, to } = getFromAndToFromTimeSelection(preset, customTimeRange);

    const filtered = incidents.filter((incident) => {
      if (searchTerm && !incident.name.toLowerCase().includes(searchTerm)) return false;

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          paddingX: { xs: '1rem', md: '60px' },
          paddingY: '1.3rem'
        }}
      >
        <Box
          data-testid="incidents-header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          <PageTitle title={isManaging ? "Manage incidents" : "Incidents"} />
          {!isManaging && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleOpenFilters}
              size="small"
              sx={{
                minWidth: '140px',
                height: '32px'
              }}
            >
              Sort & Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>
          )}
        </Box>
      </Box>

      <PageWrapper>
        {isManaging && (
          <Box
            data-testid="incidents-management-buttons"
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              mb: 2
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => navigate('/create')}
              color="primary"
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                maxWidth: { sm: '200px' }
              }}
            >
              Add incident
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenFilters}
              color="primary"
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                maxWidth: { sm: '200px' }
              }}
            >
              Sort & Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>
          </Box>
        )}

        <Box
          sx={{
            backgroundColor: 'background.default'
          }}
        >
          {visibleIncidents.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                padding: 4,
                flexDirection: 'column',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              <Typography variant="h6">
                {incidents?.length === 0 ? 'No incidents found' : 'No results found'}
              </Typography>
              <Typography variant="body2">
                {incidents?.length === 0
                  ? 'There are currently no incidents.'
                  : 'There are no incidents matching your filters.'}
              </Typography>
            </Box>
          ) : (
            <DataList
              items={visibleIncidents.map<ListRow>((incident) => ({
                key: incident.id,
                title: incident.name,
                content: (
                  <Typography variant="body2">{getAuthor(incident)}</Typography>
                ),
                footer: Format.date(incident.startedAt),
                titleDot: <StageMini stage={incident.stage} />,
                onClick: () => navigate(`/logbook/${incident.id}`)
              }))}
            />
          )}
        </Box>
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
        />
      </PageWrapper>
    </Box>
  );
};

export default Incidents;
