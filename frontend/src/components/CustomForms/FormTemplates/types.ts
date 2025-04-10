// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export type Field = {
    id: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'select';
    options?: string[]
    required?: boolean;
  };


export interface Form {
    id: string;
    title: string;
    formData: object;
    createdAt: string;
    authorName?: string;
  }

export interface FormInstance extends Form {
    formTemplateId: string;
  }