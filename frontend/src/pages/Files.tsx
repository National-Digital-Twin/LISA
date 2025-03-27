import { useParams } from 'react-router-dom';

import { useIncidents, useLogEntriesUpdates } from '../hooks';
import { PageTitle } from '../components';
import { useAttachments } from '../hooks/useAttachments';
import Attachments from '../components/Attachments';
import PageWrapper from '../components/PageWrapper';
import { Format } from '../utils';

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
      <PageTitle
        title={Format.incident.type(incident.type)}
        subtitle={incident?.name ?? ''}
        stage={incident.stage}
      />
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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
