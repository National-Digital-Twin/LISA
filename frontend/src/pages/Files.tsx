import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useIncidents, useLogEntriesUpdates } from '../hooks';
import { Format } from '../utils';
import { PageTitle } from '../components';
import { useAttachments } from '../hooks/useAttachments';
import Attachments from '../components/Attachments';

export default function Files() {
  const { incidentId } = useParams();
  const { incidents } = useIncidents();
  const { attachments } = useAttachments(incidentId);
  useLogEntriesUpdates(incidentId || '');

  const incident = incidents?.find((inc) => inc.id === incidentId);
  const subtitle = useMemo(() => Format.incident.name(incident), [incident]);
  if (!incident || !incidentId) {
    return null;
  }

  return (
    <div className="wrapper">
      <div className="container">
        <PageTitle title="Incident files" subtitle={subtitle} />
        <Attachments
          incidentId={incidentId}
          title="Recordings"
          emptyMsg="No recordings"
          attachments={attachments?.filter((att) => att.type === 'Recording') || []}
        />
        <Attachments
          incidentId={incidentId}
          title="Attachments"
          emptyMsg="No attachments"
          attachments={attachments?.filter((att) => att.type === 'File') || []}
        />
        <Attachments
          incidentId={incidentId}
          title="Sketches"
          emptyMsg="No sketches"
          attachments={attachments?.filter((att) => att.type === 'Sketch') || []}
        />
      </div>
    </div>
  );
}
