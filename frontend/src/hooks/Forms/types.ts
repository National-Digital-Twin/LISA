// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Form, FormData, FormInstance } from "../../components/CustomForms/FormTemplates/types";

// Create Form Template types
export type CreateFormTemplatePayload = {
    title: string;
    formData: FormData;
  };

export type CreateFormTemplateContext = {
    previousForms?: Form[];
  };

// Create Form Incident types
export type CreateFormInstancePayload = {
  title: string;
  formTemplateId: string;
  formData: object;
};

export type CreateFormInstanceContext = {
  previousForms?: FormInstance[];
};