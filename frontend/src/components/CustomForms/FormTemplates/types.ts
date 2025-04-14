// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export type Field = {
    id: string;
    label: string;
    type: 'string' | 'textarea' | 'number' | 'boolean' | 'select';
    options?: string[]
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

export interface FormInstance extends Omit<Form, 'formData'> {
    formData: object;
    formTemplateId: string;
  }