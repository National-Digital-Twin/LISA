/* eslint-disable import/no-extraneous-dependencies */
import { withTheme } from '@rjsf/core';
import { Theme as Mui5Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { Box, Typography } from '@mui/material';
import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';

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
      />
    </Box>
  </Box>
);

export default FormPreview;
