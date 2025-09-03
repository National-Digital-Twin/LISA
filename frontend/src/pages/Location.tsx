// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { LogEntry } from 'common/LogEntry';
import { Task } from 'common/Task';
import { type Location as LocationUnion } from 'common/Location';

// Local imports
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import GenericPointsMap from '../components/Map/GenericPointsMap';
import { FullLocationType } from '../utils/types';

type LocationRouteState = LogEntry | Task | undefined;

function normaliseLocations(entity: LocationRouteState): FullLocationType[] | undefined {
  if (!entity) return undefined;
  const loc = (entity).location as LocationUnion | null | undefined;
  if (!loc) return undefined;

  if (loc.type === 'coordinates' || loc.type === 'both') {
    const coordinates = Array.isArray(loc.coordinates) ? loc.coordinates : [];
    if (coordinates.length === 0) return undefined;
    return [{ coordinates } as FullLocationType];
  }

  return undefined;
}

const Location = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const locations = useMemo(() => normaliseLocations(state), [state]);

  return (
    <PageWrapper>
      <PageTitle
        title="Location"
        titleStart={
          <IconButton aria-label="Back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        } />
      <GenericPointsMap locations={locations} />
    </PageWrapper>
  );
};

export default Location;
