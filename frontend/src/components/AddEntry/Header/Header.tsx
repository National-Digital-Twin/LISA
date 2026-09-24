// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Box, Typography } from '@mui/material';
// Local imports
import { type ValidationError } from '../../../utils/types';
import Tabs from './Tabs';

interface Props {
  fileCount: number;
  validationErrors: Array<ValidationError>;
  showValidationErrors: boolean;
}
export default function Header({
  fileCount,
  validationErrors,
  showValidationErrors
}: Readonly<Props>) {
  return (
    <Box>
      <Typography variant="h2" fontSize="1.3rem" mb={2}>
        Create new log entry
      </Typography>
      <Tabs
        fileCount={fileCount}
        validationErrors={validationErrors}
        showValidationErrors={showValidationErrors}
      />
    </Box>
  );
}
