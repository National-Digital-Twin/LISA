// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Form, FormData, FormInstance } from "../../components/CustomForms/FormTemplates/types";

// Create Form Template types
export type CreateFormTemplatePayload = {
    title: string;
    formData: FormData;
  };

export type CreateFormTemplateContext = {
    previousFormTemplates?: Form[];
  };

// Create Form Incident types
export type CreateFormInstancePayload = {
  title: string;
  formTemplateId: string;
  formData: object;
};

export type CreateFormInstanceContext = {
  previousFormInstances?: FormInstance[];
};