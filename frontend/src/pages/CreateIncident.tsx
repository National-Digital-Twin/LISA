// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useNavigate } from "react-router-dom";
import { IncidentInputContainer } from "../components/Incident/IncidentInputContainer";
import PageWrapper from "../components/PageWrapper";
import { useCreateIncident } from "../hooks";
import { Incident } from "common/Incident";

export default function CreateIncident() {
  const { createIncident } = useCreateIncident();
  const navigate = useNavigate();

  const handleSubmit = (
    incident: Incident,
  ) => {
    createIncident(incident as Incident, {
      onSuccess: (newIncident) => {
        setTimeout(() => {
          navigate(`/logbook/${newIncident.id}`);
        }, 1000);
      },
      onError: () => {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    });
  };


  return (
    <PageWrapper>
      <IncidentInputContainer
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </PageWrapper>
  );
}
