// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Theme as Mui5Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { JSONSchema7 } from 'json-schema';
import { IChangeEvent, ThemeProps, withTheme } from '@rjsf/core';
import { RJSFSchema, RJSFValidationError } from '@rjsf/utils';
import CustomLabelField from '../FormTemplates/CustomLabelField';
import { Form, FormDataProperty } from '../FormTemplates/types';
import { UiTemplates } from './UiTemplates';
import { UiWidgets } from './UiWidgets';
import { ValidationError } from '../../../utils/types';
import { useEffect, useRef } from 'react';

type AddFormProps = {
  selectedForm: Form;
  selectedFormData: FormDataProperty[];
  onChange: (id: string, label: string, value: string) => void;
  setErrors?: (errors: ValidationError[]) => void;
};

const FormTheme: ThemeProps = {
  templates: { ...Mui5Theme.templates, ...UiTemplates },
  fields: Mui5Theme.fields,
  widgets: { ...Mui5Theme.widgets, ...UiWidgets }
};

const RJSFForm = withTheme(FormTheme);

const AddFormInstance = ({
  selectedForm,
  selectedFormData,
  onChange,
  setErrors = undefined
}: AddFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any | null>(null);

  useEffect(() => {
    formRef.current.validateForm();
  }, [formRef]);

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
      const { formData, errors } = data;
      const { schema } = selectedForm.formData;
      const labelMap = getLabelMap(schema);
      const key = id.replace('root_', '');
      const property = schema.properties?.[key];
      let normalisedValue = formData[key];

      if (errors) {
        handleErrors(errors);
      }

      if (normalisedValue) {
        if (typeof property === 'object' && 'type' in property && property.type === 'boolean') {
          normalisedValue = normalisedValue === true ? 'Yes' : 'No';
        }

        onChange(key, labelMap[key] ?? key, normalisedValue);
      }
    }
  };

  const handleErrors = (errors: RJSFValidationError[]) => {
    if (setErrors) {
      setErrors(
        errors.map((error) => ({
          fieldId: error.property!,
          error: error.message!
        }))
      );
    }
  };

  const getParsePropertyValue = (value: string | number | boolean) => {
    if (typeof value === 'string') {
      return `"${value}"`;
    }

    return value;
  };

  const getPrefilledJsonProperty = (property: FormDataProperty) => {
    return `"${property.id}": ${getParsePropertyValue(property.value)}`;
  };

  const prefilledFormData = selectedFormData
    ? JSON.parse(`{ ${selectedFormData.map((data) => getPrefilledJsonProperty(data))} }`)
    : {};

  const uiSchema = { ...selectedForm.formData.uiSchema, 'ui:options': { label: false } };

  return (
    <RJSFForm
      ref={formRef}
      showErrorList={false}
      noHtml5Validate
      transformErrors={transformErrors}
      schema={selectedForm.formData.schema}
      validator={validator}
      uiSchema={uiSchema}
      formData={prefilledFormData}
      fields={{ label: CustomLabelField }}
      onChange={handleChange}
      onError={handleErrors}
    />
  );
};

export default AddFormInstance;
