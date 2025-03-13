// Global imports
import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// Local imports
import { IncidentMap, PageTitle } from '../components';
import { useIncidents, useLogEntries, useLogEntriesUpdates } from '../hooks';
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
  const subtitle = useMemo(() => Format.incident.name(incident), [incident]);
  const highlighted = logEntries?.find((entry) => `#${entry.id}` === hash);
  if (!incident) {
    return null;
  }

  return (
    <div className="wrapper">
      <div className="container container--location">
        <PageTitle title="Incident location" subtitle={subtitle} />

        <li className="full-width">
          <IncidentMap logEntries={logEntries} highlightId={highlighted?.id} />
        </li>
      </div>
    </div>
  );
};

export default Location;
