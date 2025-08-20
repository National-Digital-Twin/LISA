// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useEffect, useRef } from 'react';
import { Theme as Mui5Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, RJSFValidationError } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { IChangeEvent, ThemeProps, withTheme } from '@rjsf/core';
import { Box } from '@mui/material';
import { Form } from '../FormTemplates/types';
import CustomLabelField from '../FormTemplates/CustomLabelField';
import { OnFieldChange } from '../../../utils/handlers';
import { UiTemplates } from './UiTemplates';
import { UiWidgets } from './UiWidgets';
import { Field } from 'common/Field';
import { Form as FormUtils } from '../../../utils';
import { LogEntry } from 'common/LogEntry';

type Props = {
  entry: Partial<LogEntry>;
  selectedForm: Form;
  fields: Array<Field>;
  onFieldChange: OnFieldChange;
};

const FormTheme: ThemeProps = {
  templates: { ...Mui5Theme.templates, ...UiTemplates },
  fields: Mui5Theme.fields,
  widgets: { ...Mui5Theme.widgets, ...UiWidgets }
};

const RJSFForm = withTheme(FormTheme);

export const FormContainer = ({ entry, selectedForm, fields, onFieldChange }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);

  useEffect(() => {
    formRef.current?.validateForm();
  }, [formRef]);

  const validateForm = () => formRef.current?.validateForm();

  const getLabelMap = (schema: JSONSchema7): Record<string, string> => {
    const labelMap: Record<string, string> = {};
    Object.entries(schema.properties ?? {}).forEach(([key, value]) => {
      if (typeof value === 'object' && value && 'title' in value) {
        labelMap[key] = value.title as string;
      }
    });
    return labelMap;
  };

  const transformErrors = (errors: RJSFValidationError[]) => {
    if (!selectedForm?.formData) return errors;
    const labelMap = getLabelMap(selectedForm.formData.schema);

    return errors.map((error) => {
      if (error.name === 'required' && error.params?.missingProperty) {
        const key = error.params.missingProperty;
        const label = labelMap[key] ?? key;
        return {
          ...error,
          message: `${label} is required`
        };
      }
      return error;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (data: IChangeEvent<any, RJSFSchema, any>, id: string | undefined) => {
    if (id) {
      const { formData } = data;
      const key = id.replace('root_', '');
      if (formData?.[key]) {
        onFieldChange(key, formData[key]);
      }
    }
  };

  const getPrefilledJsonProperty = (field: Field) => {
    const fieldValue = FormUtils.getFieldValue(field, entry);
    if (fieldValue) {
      return `"${field.id}": "${fieldValue}"`;
    }

    return undefined;
  };

  const prefilledFormData = fields
    ? JSON.parse(
        `{ ${fields
          .map((field) => getPrefilledJsonProperty(field))
          .filter((properties) => properties)
          .join(',')} }`
      )
    : {};

  return (
    <Box
      display="flex"
      flexDirection="column"
      displayPrint="none"
      sx={{ '.MuiFormHelperText-root': { display: 'none' } }}
    >
      <Box padding={2} bgcolor="background.default">
        <RJSFForm
          ref={formRef}
          showErrorList={false}
          noHtml5Validate
          transformErrors={transformErrors}
          schema={selectedForm.formData.schema}
          validator={validator}
          uiSchema={selectedForm.formData.uiSchema}
          formData={prefilledFormData}
          onChange={handleChange}
          onBlur={validateForm}
          fields={{ label: CustomLabelField }}
        />
      </Box>
    </Box>
  );
};
