// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { PageTitle } from "../../components";
import { Format } from "../../utils";
import PageWrapper from "../../components/PageWrapper";
import { useIncidents } from "../../hooks";
import { useResponsive } from '../../hooks/useResponsiveHook';
import AddFormInstance from "../../components/CustomForms/FormInstances/AddFormInstance";
import { useFormInstances } from "../../hooks/Forms/useFormInstances";


const FormInstances = () => {
  const { incidentId } = useParams();
  const query = useIncidents();
  const { forms, isLoading, isError, error } = useFormInstances(incidentId);
  const location = useLocation();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const [highlightedFormId, setHighlightedFormId] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>();
  

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightedFormId(elementId);
  
        setTimeout(() => {
          setHighlightedFormId(null);
        }, 2000); 
      }
    }
  }, [location]);

  const onAddFormClick = () => {
    navigate('#');
    setAdding(true);
  };

  const onCancel = () => {
    document.documentElement.scrollTo(0, 0);
    setAdding(false);
  };

  const incident = query?.data?.find((inc) => inc.id === incidentId);

  if (!incident) return null;

  return ( 
    <PageWrapper>
      <PageTitle
        title={Format.incident.type(incident.type)}
        subtitle={incident.name}
        stage={incident.stage}
      >
        {!adding && (
          <Button
            type="button"
            variant="contained"
            size={isMobile ? 'medium' : 'large'}
            startIcon={<AddCircleIcon />}
            onClick={onAddFormClick}
          >
              Fill out Form
          </Button>
        )}
      </PageTitle>
      {adding && (
        <AddFormInstance
          onCancel={onCancel}
        />
      )}
      {!adding && (
        <Box display="flex" flexDirection="column" gap={2}>
          {isLoading && <p>Loading forms...</p>}
          {isError && <p>Error loading forms: {error?.message}</p>}
          {forms?.length === 0 && <>
            <h3>There are currently no forms.</h3>
            <hr />
          </>}
          {forms?.map((form) => (
            <Box
              key={form.id}
              id={form.id}
              display="flex"
              flexDirection="column"
              gap={1}
              sx={(theme) => ({
                backgroundColor:
                  highlightedFormId === form.id
                    ? `${theme.palette.primary.main}20`
                    : 'transparent',
                border: highlightedFormId === form.id ? `1px solid ${theme.palette.primary.main}` : 'none',
                borderRadius: 2,
                transition: 'background-color 0.4s ease, border 0.4s ease',
                padding: 2,
              })}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                {form.title}
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} bgcolor="background.default" padding={2}>
                {(form.formData as { fieldId: string; label: string; value: string }[]).map((field) => (
                  <Box key={field.fieldId} display="flex" flexDirection="column" gap={0.5}>
                    <Typography variant="body1" fontWeight="bold">
                      {field.label}:
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{field.value}</Typography>
                  </Box>
                ))}
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
              Submitted by: <strong>{form.authorName ?? 'Unknown'}</strong> on{' '}
                    {Format.dateAndTimeMobile(form.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

    </PageWrapper>
  )
}

export default FormInstances;
