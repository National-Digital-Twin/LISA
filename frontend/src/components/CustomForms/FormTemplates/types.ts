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