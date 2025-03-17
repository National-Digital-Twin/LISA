import { useParams } from 'react-router-dom';

import { useIncidents, useLogEntriesUpdates } from '../hooks';
import { PageTitle } from '../components';
import { useAttachments } from '../hooks/useAttachments';
import Attachments from '../components/Attachments';
import PageWrapper from '../components/PageWrapper';

export default function Files() {
  const { incidentId } = useParams();
  const query = useIncidents();
  const { attachments } = useAttachments(incidentId);
  useLogEntriesUpdates(incidentId ?? '');

  const incident = query.data?.find((inc) => inc.id === incidentId);
  if (!incident || !incidentId) {
    return null;
  }

  return (
    <PageWrapper>
      <PageTitle title="Incident files" />
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
    </PageWrapper>
  );
}
