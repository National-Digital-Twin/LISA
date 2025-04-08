export type Field = {
    id: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'select';
    options?: string[]
  };