// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { type User } from 'common/User';
import { FormField } from '../Form';
import PageWrapper from '../PageWrapper';
import { PageTitle } from '..';
import { type ValidationError } from '../../utils/types';

interface AssigneeStepProps {
  assignee: User;
  options: Array<{ value: string; label: string }>;
  error?: ValidationError;
  onChange: (assignee: User) => void;
  onBack: () => void;
}

export function AssigneeStep({ assignee, options, error = undefined, onChange, onBack }: Readonly<AssigneeStepProps>) {
  const handleFieldChange = (_: string, value: unknown) => {
    const found = options?.find((o) => o.value === value);
    if (found) {
      onChange({ username: found.value, displayName: found.label });
    }
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Add assignee"
        titleStart={
          <IconButton aria-label="Back" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
      <Box display="flex" flexDirection="column" gap={2} bgcolor="background.default" padding={2}>
        <FormField
          field={{
            id: 'task_assignee',
            type: 'Select',
            label: 'Select',
            value: assignee.username,
            options
          }}
          onChange={handleFieldChange}
          error={error}
        />
      </Box>
    </PageWrapper>
  );
}
