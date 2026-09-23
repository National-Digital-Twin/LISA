// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';

export type Field = {
  id: string;
  label: string;
  type: 'string' | 'textarea' | 'number' | 'boolean' | 'select' | 'label';
  options?: string[];
  required?: boolean;
};

export interface FormData {
  schema: JSONSchema7;
  uiSchema: UiSchema;
}

export interface Form {
  id: string;
  title: string;
  formData: FormData;
  createdAt: string;
  authorName?: string;
}

export interface FormDataProperty {
  id: string;
  label: string;
  value: string | number | boolean;
}

export interface FormInstance extends Omit<Form, 'formData'> {
  formData: object;
  formTemplateId: string;
}
