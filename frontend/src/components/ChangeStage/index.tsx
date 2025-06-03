// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { MouseEvent, useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid } from '@mui/material';

// Local imports
import { type Incident } from 'common/Incident';
import { type IncidentStage } from 'common/IncidentStage';
import { Form, Format } from '../../utils';
import { MODAL_KEY } from '../../utils/constants';
import { type FieldValueType, type ValidationError } from '../../utils/types';
import { FormField, FormFooter } from '../Form';
import Modal from '../Modal';
import { STAGE_FIELD } from './constants';
import Stage from '../Stage';

import { GridListItem } from '../GridListItem';

interface Props {
  incident: Incident;
  onChangeStage: (stage: IncidentStage) => void;
  onCancel: () => void;
}
export default function ChangeStage({ incident, onChangeStage, onCancel }: Readonly<Props>) {
  const [modal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const [stage, setStage] = useState<IncidentStage>(incident?.stage);
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  useEffect(() => {
    if (stage) {
      if (stage === incident.stage) {
        setValidationErrors([{ fieldId: STAGE_FIELD.id, error: 'Stage has not changed' }]);
      } else {
        setValidationErrors([]);
      }
    } else {
      setValidationErrors([{ fieldId: STAGE_FIELD.id, error: 'Stage required' }]);
    }
  }, [stage, incident?.stage]);

  if (!incident) {
    return null;
  }

  const onSubmit = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    // Do the submission to the backend.
    onChangeStage(stage);
  };

  const onFieldChange = (id: string, value: FieldValueType) => {
    if (id === 'stage') {
      setStage(value as IncidentStage);
    }
  };

  return (
    <Modal modal={modal} onClose={onCancel}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h2" fontSize="1.6rem">
          Change incident stage
        </Typography>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          id="rollup-log-book-entry"
        >
          <Grid component="ul" container spacing={4} bgcolor="background.default" padding={3}>
            <GridListItem title="Current stage">
              <Stage
                label={Format.incident.stage(incident.stage).toUpperCase()}
                stage={incident.stage}
              />
            </GridListItem>
            <Grid component="li" size={{ xs: 12, md: 6 }}>
              <FormField
                field={{ ...STAGE_FIELD, value: stage }}
                error={
                  showValidationErrors ? Form.getError(STAGE_FIELD, validationErrors) : undefined
                }
                onChange={onFieldChange}
              />
            </Grid>
          </Grid>
          <FormFooter
            validationErrors={validationErrors}
            onCancel={onCancel}
            onSubmit={onSubmit}
            onShowValidationErrors={setShowValidationErrors}
          />
        </Box>
      </Box>
    </Modal>
  );
}
