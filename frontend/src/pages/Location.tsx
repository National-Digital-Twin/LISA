// Global imports
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// Local imports
import { IncidentMap, PageTitle } from '../components';
import { useIncidents, useLogEntries, useLogEntriesUpdates } from '../hooks';
import PageWrapper from '../components/PageWrapper';
import { Format } from '../utils';

const Location = () => {
  const { hash } = useLocation();
  const { incidentId } = useParams();
  const query = useIncidents();
  const { logEntries } = useLogEntries(incidentId);
  useLogEntriesUpdates(incidentId ?? '');

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  const incident = query.data?.find((inc) => inc.id === incidentId);
  const highlighted = logEntries?.find((entry) => `#${entry.id}` === hash);
  if (!incident) {
    return null;
  }

  return (
    <PageWrapper>
      <PageTitle
        title={Format.incident.type(incident.type)}
        subtitle={incident?.name ?? ''}
        stage={incident.stage}
      />
      <IncidentMap logEntries={logEntries} highlightId={highlighted?.id} />
    </PageWrapper>
  );
};

export default Location;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
