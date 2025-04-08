/* eslint-disable import/no-extraneous-dependencies */
import { withTheme } from '@rjsf/core';
import { Theme as Mui5Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { Paper } from '@mui/material';
import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';

const Form = withTheme(Mui5Theme);

const FormPreview = ({ schema, uiSchema }: { schema: JSONSchema7; uiSchema: UiSchema }) => (
  <Paper sx={{ p: 3 }}>
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={() => console.log(`Form submitted: Schema | ${JSON.stringify(schema)} | UiSchema | ${JSON.stringify(uiSchema)}`)}
    />
  </Paper>
);

export default FormPreview;
