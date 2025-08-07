import { useEffect, useRef } from 'react';
import { IChangeEvent, withTheme } from '@rjsf/core';
import { Theme as Mui5Theme } from '@rjsf/mui';
import { Box } from '@mui/material';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, RJSFValidationError } from '@rjsf/utils';
import { Form } from '../CustomForms/FormTemplates/types';
import { OnFieldChange } from '../../utils/handlers';
import { FieldValueType } from '../../utils/types';

type Props = {
  selectedForm: Form;
  showValidationErrors: boolean;
  onFieldChange: OnFieldChange;
};

const RJSForm = withTheme(Mui5Theme);

const EntryForm = ({ selectedForm, showValidationErrors, onFieldChange }: Props) => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (data: IChangeEvent<any, RJSFSchema, any>, id: string | undefined) => {
    if (id) {
      const { formData } = data;
      const key = id.replace('root_', '');
      if (formData && formData[key]) {
        onFieldChange(key, data.formData[key] as FieldValueType);
      }
    }
  };

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
        onChange={onChange}
      />
    </Box>
  );
};

export default EntryForm;
