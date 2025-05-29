// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Typography, Grid2 as Grid } from '@mui/material';
// Local imports
import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { FieldValue } from './FieldValue';

interface Props {
  field: Field;
  entry: LogEntry;
}
export function FieldItem({ field, entry }: Readonly<Props>) {
  if (field.type === 'Label') {
    return null;
  }

  const value = entry.fields?.find((ef) => ef.id === field.id)?.value;
  if (!value && field.type !== 'Location' && field.type !== 'SelectLogEntry') {
    return null;
  }

  return (
    <Grid component="li" container width="100%" columnGap={32}>
      <Grid size={{ xs: 12, md: 'grow' }}>
        <Typography variant="body1" fontWeight="bold">
          {field.label}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 'grow' }}>
        <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
          <FieldValue field={field} entry={entry} value={value} />
        </Typography>
      </Grid>
    </Grid>
  );
}
