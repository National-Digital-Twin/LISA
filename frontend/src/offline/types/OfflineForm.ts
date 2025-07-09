import { FormInstance } from "../../components/CustomForms/FormTemplates/types";

export type OfflineFormInstance = FormInstance & {
    expiresAt: string;
  };