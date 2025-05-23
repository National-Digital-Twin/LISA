// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { withTheme } from '@rjsf/core';
import { Theme as Mui5Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { Box, Typography } from '@mui/material';
import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import CustomLabelField from './CustomLabelField';

const Form = withTheme(Mui5Theme);

const FormPreview = ({ schema, uiSchema }: { schema: JSONSchema7; uiSchema: UiSchema }) => (
  <Box display="flex" flexDirection="column" gap={2}>
    <Typography variant="h2" fontSize="1.6rem">
        Form Preview
    </Typography>
    <Box sx={{ p: 3 }} bgcolor="background.default">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        fields={{ label: CustomLabelField }}
      />
    </Box>
  </Box>
);

export default FormPreview;
