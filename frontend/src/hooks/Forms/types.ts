import { Form } from "../../components/CustomForms/FormTemplates/types";

// Create Form Template types
export type CreateFormTemplatePayload = {
    title: string;
    formData: object;
  };

// Create Form Incident types
export type CreateFormInstancePayload = {
  title: string;
  formTemplateId: string;
  formData: object;
};

// Common to both
export type CreateFormContext = {
  previousForms?: Form[];
};