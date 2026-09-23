// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  entry: LogEntry;
}
export default function FormSubmitted({ entry }: Readonly<Props>) {
  if (!entry.details) {
    return null;
  }

  const formName = entry.details?.submittedFormTitle;
  const formId = entry.details?.submittedFormId;

  return (
    <Box display="flex" flexDirection="row" justifyContent="left" alignItems="center" component="ul" gap={1} sx={{ width: '100%', mb: 2}}>
      <Typography variant="body1" fontWeight="bold">
          Form Name:
      </Typography>
      <Typography component={Link} to={`/forms/${entry.incidentId}#${formId}`} color="primary" fontWeight="bold">
        {formName}
      </Typography>
    </Box>
  );
}
