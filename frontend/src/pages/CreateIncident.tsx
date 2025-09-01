// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogEntry } from "common/LogEntry";
import { Incident } from "common/Incident";
import { IncidentInputContainer } from "../components/Incident/IncidentInputContainer";
import PageWrapper from "../components/PageWrapper";
import { useAuth, useCreateIncident, useCreateLogEntry, useIncidents } from "../hooks";
import { isAdmin } from "../utils/userRoles";

export default function CreateIncident() {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user.current);
  const navigate = useNavigate();
  const { incidentId } = useParams<{ incidentId?: string }>();

  const isEditing = !!incidentId;

  useEffect(() => {
    if (!isUserAdmin) {
      navigate("/incidents", { replace: true });
    }
  }, [isUserAdmin, navigate]);

  if (!isUserAdmin) return null;

  return isEditing ? (
    <EditIncidentPage incidentId={incidentId!} />
  ) : (
    <NewIncidentPage />
  );
}

function NewIncidentPage() {
  const navigate = useNavigate();
  const { createIncident } = useCreateIncident();

  return (
    <PageWrapper>
      <IncidentInputContainer
        isEditing={false}
        initialIncident={undefined}
        onSubmit={(payload) => {
          if (payload.mode !== 'create') return;
          createIncident(payload.incident, {
            onSuccess: (created) => setTimeout(() => navigate(`/logbook/${created.id}`), 1000),
            onError: () => setTimeout(() => navigate('/'), 1000),
          });
        }}
        onCancel={() => navigate(-1)}
      />
    </PageWrapper>
  );
}

function EditIncidentPage({ incidentId }: { incidentId: string }) {
  const navigate = useNavigate();
  const { data: incidents = [] } = useIncidents();
  const { createLogEntry } = useCreateLogEntry(incidentId);

  const initialIncident = useMemo<Incident | undefined>(
    () => incidents.find((i) => i.id === incidentId),
    [incidents, incidentId]
  );

  return (
    <PageWrapper>
      <IncidentInputContainer
        isEditing
        initialIncident={initialIncident}
        onSubmit={(payload) => {
          if (payload.mode !== 'edit') return;
          createLogEntry(
            { logEntry: payload.logEntry as LogEntry },
            {
              onSuccess: () =>
                setTimeout(() => navigate(`/logbook/${initialIncident?.id}`), 1000),
              onError: () => setTimeout(() => navigate('/'), 1000),
            }
          );
        }}
        onCancel={() => navigate(-1)}
      />
    </PageWrapper>
  );
}