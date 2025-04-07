
// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import { type Incident } from 'common/Incident';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IncidentStages } from 'common/IncidentStage';
import { IncidentTypes } from 'common/IncidentTypes';
import type { FieldOption } from 'common/Field';
import {
  Box,
  Button,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import Filter from '../components/Filter/Filter';
import type { FieldValueType } from '../utils/types';
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
  const navigate = useNavigate();

  const incidents = query.data;
  const openCount = incidents?.filter(open)?.length ?? 0;
  const openCountName = openCount === 0 ? 'No' : openCount.toString();
  const closedCount = (incidents?.length ?? 0) - openCount;
  const closedCountName = closedCount === 0 ? 'None' : `+${closedCount.toString()}`;
  const title = `${openCountName} active incident${openCount === 1 ? '' : 's'}`;
  const subtitle = `(${closedCountName} closed)`;

  const [incidentFilters, setIncidentFilters] = useState<Record<string, FieldValueType>>({
    name: '',
    author: [],
    type: [],
    stage: 'Active'
  });


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openFilters = Boolean(anchorEl);

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  
  const onFilterChange = (id: string, value: FieldValueType) => {
    setIncidentFilters((prev) => ({ ...prev, [id]: value }));
  };

  function checkStageAgainstFilter(incident : Incident, stage : FieldValueType) : boolean {
    if (stage) {
      if (stage === 'Active') {
        if (incident.stage === 'Closed') {
          return false;
        }
      } else if (incident.stage !== stage) {
        return false;
      }
    }

    return true;
  }
  

  const buildFilterOptions = (field: 'reportedBy') => {
    const values = (incidents ?? [])
      .map((i) => (field === 'reportedBy' ? i.reportedBy?.username : i.type))
      .filter(Boolean) as string[];
  
    const counts = values.reduce<Record<string, number>>((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(counts).map(([value, count]) => ({
      value,
      label: `${value} (${count})`
    })) as FieldOption[];
  };

  const buildTypeFilterOptions = (): FieldOption[] => {
    if(!incidents) return [];

    const typeCounts = incidents.reduce<Record<string, number>>((acc, incident) => {
      const typeKey = incident.type;
      if (typeKey) {
        acc[typeKey] = (acc[typeKey] || 0) + 1;
      }
      return acc;
    }, {});
  
    return Object.entries(typeCounts)
      .map(([key, count]) => {
        const typeDef = IncidentTypes[key as keyof typeof IncidentTypes];
        if (!typeDef || typeDef.legacy) return null;
  
        return {
          value: key,
          label: `${typeDef.label} (${count})`
        };
      })
      .filter((item): item is FieldOption => item !== null);
  };
  
  const stageOptions: FieldOption[] = [
    { value: 'Active', label: 'Active' },
    ...Object.entries(IncidentStages).map(([stageKey, { label }]) => ({
      value: stageKey,
      label
    }))
  ];
  
  const matchesFilters = (incident: Incident): boolean => {
    const { name, author, type, stage } = incidentFilters;
  
    if (name && !incident.name.toLowerCase().includes((name as string).toLowerCase())) {
      return false;
    }
  
    if (Array.isArray(author) && author.length > 0) {
      if (!author.includes(incident.reportedBy?.username ?? '')) {
        return false;
      }
    }
    
    if (Array.isArray(type) && type.length > 0) {
      if (!type.includes(incident.type)) {
        return false;
      }
    }
  
    return checkStageAgainstFilter(incident, stage);
  };

  const onAddIncident = () => {
    navigate('/createlog');
  };

  const [sortAsc, setSortAsc] = useState(false);

  const onSortClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSortAsc((prev) => !prev);
  };

  const sortIcon = (
    <KeyboardArrowUpIcon
      sx={{
        transform: sortAsc ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease-in-out'
      }}
    />
  );

  const sortedIncidents = [...(incidents ?? [])]
    .filter((i) => matchesFilters(i))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt ?? a.startedAt).getTime();
      const dateB = new Date(b.createdAt ?? b.startedAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });


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
          {/* Sort (left) only on mobile */}
          {isMobile ? (
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="text"
                onClick={onSortClick}
                endIcon={sortIcon}
                color="secondary"
              >
          Sort
              </Button>
              <Button
                type="button"
                variant="contained"
                size="medium"
                startIcon={<AddCircleIcon />}
                onClick={onAddIncident}
                color="primary"
              >
          Add New Incident
              </Button>
            </Box>
          ) : (
          // Desktop: Only show Add button aligned right
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
                size="large"
                startIcon={<AddCircleIcon />}
                onClick={onAddIncident}
                color="primary"
              >
          Add New Incident
              </Button>
            </Box>
          )}
        </Box>
      </PageTitle>


      <Box mb={3} display="flex" flexDirection="column" gap={2}>
        {/* Top row: Search + Filter (mobile) OR all filters (desktop) */}
        {isMobile ? (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="stretch"
            gap={1}
            width="100%"
          >
            {/* Search input */}
            <Box flexGrow={1} minWidth={0}>
              <Filter
                isMobile
                appliedFilters={incidentFilters}
                onChange={onFilterChange}
                filters={[
                  {
                    id: 'name',
                    label: 'Search',
                    hintText: 'Search...',
                    type: 'text'
                  }
                ]}
              />
            </Box>

            {/* Filter button */}
            <Button
              variant="outlined"
              color="secondary"
              endIcon={<FilterAltIcon color={anchorEl ? 'primary' : 'secondary'} />}
              onClick={handleOpenFilters}
              sx={{
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
        Filter
            </Button>

            {/* Popover for mobile filters */}
            <Popover
              open={openFilters}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: -10, horizontal: 'left' }}
              PaperProps={{
                sx: {
                  width: '100vw',
                  maxWidth: '100vw',
                  left: 0,
                  ml: 2,
                  p: 2,
                  borderRadius: 0
                }
              }}
            >
              <Box display="flex" flexDirection="column" gap={2}>
                <Filter
                  isMobile
                  appliedFilters={incidentFilters}
                  onChange={onFilterChange}
                  filters={[
                    {
                      id: 'author',
                      label: 'Author',
                      hintText: 'Everyone',
                      type: 'multiselect',
                      options: buildFilterOptions('reportedBy')
                    },
                    {
                      id: 'type',
                      label: 'Incident type',
                      hintText: 'Any',
                      type: 'multiselect',
                      options: buildTypeFilterOptions()
                    }
                  ]}
                />
              </Box>
            </Popover>
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="flex-start"
            flexWrap="wrap"
            gap={2}
            width="100%"
          >
            {/* Each filter rendered individually to stay in one row */}
            <Filter
              isMobile={false}
              appliedFilters={incidentFilters}
              onChange={onFilterChange}
              filters={[
                {
                  id: 'name',
                  label: 'Search',
                  hintText: 'Search...',
                  type: 'text'
                }
              ]}
            />
        
            <Filter
              isMobile={false}
              appliedFilters={incidentFilters}
              onChange={onFilterChange}
              filters={[
                {
                  id: 'author',
                  label: 'Author',
                  hintText: 'Everyone',
                  type: 'multiselect',
                  options: buildFilterOptions('reportedBy')
                }
              ]}
            />
        
            <Filter
              isMobile={false}
              appliedFilters={incidentFilters}
              onChange={onFilterChange}
              filters={[
                {
                  id: 'type',
                  label: 'Incident type',
                  hintText: 'Any',
                  type: 'multiselect',
                  options: buildTypeFilterOptions(),
                  maxWidth: 350
                }
              ]}
            />
        
            {/* Sort button aligned right */}
            <Box sx={{ marginLeft: 'auto' }}>
              <Button variant="text" onClick={onSortClick} endIcon={sortIcon} color="secondary">
              Sort
              </Button>
            </Box>
          </Box>
        
        )}

        {/* Stage chips always visible below, scrollable on mobile */}
        <Box
          mt={1}
          sx={{
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            flexWrap={isMobile ? 'nowrap' : 'wrap'}
            gap={1}
            sx={{
              px: 1,
              '& > *': {
                flexShrink: 0
              }
            }}
          >
            <Filter
              isMobile={isMobile}
              appliedFilters={incidentFilters}
              onChange={onFilterChange}
              filters={[
                {
                  id: 'stage',
                  label: '',
                  type: 'chip-group',
                  options: stageOptions
                }
              ]}
            />
          </Box>
        </Box>
      </Box>




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
            {sortedIncidents.map((incident) => {
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
