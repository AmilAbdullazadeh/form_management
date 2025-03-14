import { FormField } from "./form";

export interface Form {
    id: string;
    title: string;
    description: string;
    createdAt: string;
  }
  
  export interface FormsState {
    forms: Form[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  export interface FieldsState {
    fields: FormField[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }