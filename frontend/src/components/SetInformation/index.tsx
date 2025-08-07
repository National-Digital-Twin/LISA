// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { MouseEvent, useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid } from '@mui/material';

import { type Field } from 'common/Field';
import { type Incident } from 'common/Incident';
import { type LogEntry } from 'common/LogEntry';
 
import { LogEntryTypes } from 'common/LogEntryTypes';
import { Form } from '../../utils';
import { MODAL_KEY } from '../../utils/constants';
import { FieldValueType, ValidationError } from '../../utils/types';
import { FormField, FormFooter } from '../Form';
import Modal from '../Modal';
import { getDirtyEntry, getInitialEntry, validate } from './utils';

interface Props {
  incident: Incident;
  onSetInformation: (setInformationEntry: Partial<LogEntry>) => void;
  onCancel: () => void;
}
export default function SetInformation({ incident, onSetInformation, onCancel }: Readonly<Props>) {
  const [modal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [entry, setEntry] = useState<Partial<LogEntry>>({});
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    if (!incident) return;

    setEntry(getInitialEntry(incident));
  }, [incident]);

  useEffect(() => {
    if (!incident || !entry.type) return;

    const type = LogEntryTypes.SetIncidentInformation;
    setFields(type?.fields(entry) || []);
    setValidationErrors(validate(entry, incident));
  }, [entry, incident]);

  if (!incident || !entry.type) {
    return null;
  }

  const onFieldChange = (id: string, value: FieldValueType) => {
    setEntry((prev) => Form.updateLogEntry(prev, id, value, true));
  };

  const onSubmit = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    const dirtyEntry = getDirtyEntry(entry, incident);
    onSetInformation(dirtyEntry);
  };

  const nameField = fields.find((f) => f.id === 'name');
  const referrerFields = fields.filter((f) => f.id.startsWith('referrer.'));
  if (!nameField) {
    return null;
  }

  return (
    <Modal modal={modal} onClose={onCancel}>
      <Box display="flex" flexDirection="column" gap={2} id="rollup-log-book-entry">
        <Typography variant="h5" component="h2">
          Set Incident Information
        </Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <Grid component="ul" container spacing={4} bgcolor="background.default" padding={3}>
            <Grid component="li" size={{ xs: 12, md: 6 }}>
              <FormField
                onChange={onFieldChange}
                key={nameField.id}
                field={{ ...nameField, value: Form.getFieldValue(nameField, entry) }}
                error={
                  showValidationErrors ? Form.getError(nameField, validationErrors) : undefined
                }
              />
            </Grid>
          </Grid>
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" component="h2">
              Referral information
            </Typography>
            <Grid component="ul" container spacing={4} bgcolor="background.default" padding={3}>
              {referrerFields.map((field) => (
                <Grid component="li" key={field.id} size={{ xs: 12, md: 6 }}>
                  <FormField
                    onChange={onFieldChange}
                    key={field.id}
                    field={{ ...field, value: Form.getFieldValue(field, entry) }}
                    error={
                      showValidationErrors ? Form.getError(field, validationErrors) : undefined
                    }
                  />
                </Grid>
              ))}
              <FormFooter
                validationErrors={validationErrors}
                onCancel={onCancel}
                onSubmit={onSubmit}
                onShowValidationErrors={setShowValidationErrors}
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
