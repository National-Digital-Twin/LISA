// Global imports
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Local imports
import { type Incident } from 'common/Incident';
import { useIncidents } from '../hooks';
import { Format } from '../utils';
import { NotificationsMenu } from './NotificationsMenu';
import Stage from './Stage';

function open(incident: Incident) {
  return incident.stage !== 'Closed';
}

const NotificationsBanner = () => {
  const { incidentId } = useParams();
  const query = useIncidents();

  const incidents = query.data;
  const incident = incidents?.find((inc) => inc.id === incidentId);
  const incidentTitle = useMemo(() => Format.incident.title(incident), [incident]);
  const openCount = incidents?.filter(open)?.length ?? 'No';
  const countTitle = useMemo(
    () => `${openCount} active incident${openCount === 1 ? '' : 's'}`,
    [openCount]
  );

  return (
    <div className="notification-container">
      <div className="alert-title">
        {incident && (
          <Stage
            label={Format.incident.stage(incident.stage)}
            stage={incident.stage}
            size="small"
            width="auto"
          />
        )}
        {incident ? incidentTitle : countTitle}
      </div>
      <NotificationsMenu />
    </div>
  );
};

export default NotificationsBanner;
