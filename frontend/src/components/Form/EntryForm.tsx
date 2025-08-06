import { useEffect, useRef } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as Mui5Theme } from '@rjsf/mui';
import { Box } from '@mui/material';
import validator from '@rjsf/validator-ajv8';
import { RJSFValidationError } from '@rjsf/utils';
import { Form } from '../CustomForms/FormTemplates/types';

type Props = {
  selectedForm: Form;
  showValidationErrors: boolean;
};

const RJSForm = withTheme(Mui5Theme);

const EntryForm = ({ selectedForm, showValidationErrors }: Props) => {
  const { schema, uiSchema } = selectedForm.formData;
  const transformErrors = (errors: RJSFValidationError[]) =>
    errors.map((error) => {
      if (error.name === 'required' && error.params?.missingProperty) {
        return { ...error, message: 'Field required' };
      }
      return error;
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (!showValidationErrors) return undefined;

    const timeout = setTimeout(() => {
      formRef.current?.validateForm();
    }, 0);

    return () => clearTimeout(timeout);
  }, [showValidationErrors]);

  return (
    <Box>
      <RJSForm
        ref={formRef}
        noHtml5Validate
        showErrorList={false}
        transformErrors={transformErrors}
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
      />
    </Box>
  );
};

export default EntryForm;
