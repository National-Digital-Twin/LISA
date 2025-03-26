// Global imports
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// Local imports
import { IncidentMap, PageTitle } from '../components';
import { useIncidents, useLogEntries, useLogEntriesUpdates } from '../hooks';
import PageWrapper from '../components/PageWrapper';

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
        title={incident?.type ?? ''}
        subtitle={incident?.name ?? ''}
        stage={incident.stage}
      />
      <IncidentMap logEntries={logEntries} highlightId={highlighted?.id} />
    </PageWrapper>
  );
};

export default Location;
