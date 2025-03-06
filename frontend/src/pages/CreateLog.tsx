// Global imports
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Local imports
import { type Referrer, type Incident } from 'common/Incident';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FormField, FormFooter } from '../components/Form';
import { useCreateIncident } from '../hooks/useIncidents';
import { Form, Incident as IncidentUtil, Validate } from '../utils';
import { type FieldValueType, type ValidationError } from '../utils/types';
import { PageTitle } from '../components';

const CreateLog = () => {
  const [incident, setIncident] = useState<Partial<Incident>>({
    stage: 'Monitoring',
    referrer: {} as Referrer
  });
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  const createIncident = useCreateIncident();
  const navigate = useNavigate();

  // Go back to where we've just come from.
  const onCancel = () => navigate(-1);

  const onSubmit = () => {
    createIncident.mutate(incident as Incident, {
      onSuccess: (data) => navigate(`/logbook/${data.id}`)
    });
  };

  const onFieldChange = (id: string, value: FieldValueType) => {
    setIncident((prev) => Form.updateIncident(prev, id, value));
  };

  useEffect(() => {
    setValidationErrors(Validate.incident(incident));
  }, [incident]);

  return (
    <div className="container">
      <PageTitle title="New Incident Log" />
      <Box display="flex" flexDirection="column" gap={4}>
        {IncidentUtil.Sections.map((section) => (
          <Box key={section.id}>
            <Typography variant="h2">{section.title}</Typography>
            <Grid container spacing={4} bgcolor="background.default" padding={3}>
              {section.fields(incident).map((field) => (
                <Grid key={field.id} size={{ xs: 12, md: 6 }}>
                  <FormField
                    key={field.id}
                    field={{ ...field, value: incident[field.id as keyof Incident] as string }}
                    error={
                      showValidationErrors ? Form.getError(field, validationErrors) : undefined
                    }
                    className={field.className}
                    onChange={onFieldChange}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        <FormFooter
          validationErrors={validationErrors}
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitLabel="Create"
          onShowValidationErrors={setShowValidationErrors}
        />
      </Box>
    </div>
  );
};

export default CreateLog;
