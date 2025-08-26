// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import IncidentPicker from '../components/IncidentPicker';
import { useIncidents } from '../hooks';
import { PageTitle } from '../components';

export default function IncidentPickerPage() {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const next = searchParams.get('next');

  const { data } = useIncidents();

  const incidents = data?.filter((inc) => inc.stage !== 'Closed');

  return (
    <PageWrapper>
      <PageTitle title="Choose an incident"
        titleStart={
          <IconButton aria-label="Back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        } />
      {next?.startsWith('/') && next.includes(':incidentId') ? (
        <IncidentPicker
          incidents={incidents ?? []}
          onSelect={(incident) => navigate(next.replace(':incidentId', incident.id))}
        />
      ) : (
        <div style={{ padding: '16px' }}>Invalid or missing next route.</div>
      )}
    </PageWrapper>
  );
}
