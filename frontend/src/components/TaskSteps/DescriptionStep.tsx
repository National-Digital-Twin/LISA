// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormField } from '../Form';
import PageWrapper from '../PageWrapper';
import { PageTitle } from '..';
import { type ValidationError } from '../../utils/types';

interface DescriptionStepProps {
  value: string;
  error?: ValidationError;
  onChange: (value: string) => void;
  onBack: () => void;
}

export function DescriptionStep({ value, error = undefined, onChange, onBack }: Readonly<DescriptionStepProps>) {
  const handleFieldChange = (_: string, newValue: unknown) => {
    onChange(String(newValue));
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Add description"
        titleStart={
          <IconButton aria-label="Back" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
      <Box display="flex" flexDirection="column" gap={2} bgcolor="background.default" padding={2}>
        <FormField
          field={{
            id: 'task_description',
            type: 'TextArea',
            label: '',
            rows: 6,
            value
          }}
          onChange={handleFieldChange}
          error={error}
        />
      </Box>
    </PageWrapper>
  );
}
