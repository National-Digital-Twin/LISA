import { useEffect, useRef } from 'react';
import { IChangeEvent, ThemeProps, withTheme } from '@rjsf/core';
import { Box } from '@mui/material';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, RJSFValidationError } from '@rjsf/utils';
import { Theme as Mui5Theme } from '@rjsf/mui';
import { type LogEntry } from 'common/LogEntry';
import { Form } from '../CustomForms/FormTemplates/types';
import { OnFieldChange } from '../../utils/handlers';
import { FieldValueType } from '../../utils/types';
import { EntryWidgets } from './EntryWidgets';
import { EntryTemplates } from './EntryTemplates';

type Props = {
  selectedForm: Form;
  showValidationErrors: boolean;
  onFieldChange: OnFieldChange;
  entry: Partial<LogEntry>;
};

const FormTheme: ThemeProps = {
  templates: { ...Mui5Theme.templates, ...EntryTemplates },
  fields: Mui5Theme.fields,
  widgets: { ...Mui5Theme.widgets, ...EntryWidgets }
};

const RJSForm = withTheme(FormTheme);

const EntryForm = ({ selectedForm, showValidationErrors, onFieldChange, entry }: Props) => {
  const { schema, uiSchema } = selectedForm.formData;
  const transformErrors = (errors: RJSFValidationError[]) => {
    if (!showValidationErrors) return [];

    return errors.map((error) => {
      if (error.name === 'required' && error.params?.missingProperty) {
        return { ...error, message: 'Field required' };
      }
      return error;
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (!showValidationErrors) {
      return undefined;
    }

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

  const prefilledFormData = JSON.parse(
    `{ ${entry?.fields?.flatMap((field) => `"${field.id}": "${field.value}"`).join(',')} }`
  );

  return (
    <Box>
      <RJSForm
        ref={formRef}
        noHtml5Validate
        showErrorList={false}
        transformErrors={transformErrors}
        schema={schema}
        uiSchema={uiSchema}
        formData={prefilledFormData}
        validator={validator}
        onChange={onChange}
      />
    </Box>
  );
};

export default EntryForm;
