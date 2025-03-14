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

export type FormSubmitFn<T> = (arg0: T) => Promise<void> | void;
export type FormValidateFn<T> = (arg0: T) => Partial<Record<keyof T, string>>;

export interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (formData: T) => Promise<void> | void;
  validate?: (formData: T) => Partial<Record<keyof T, string>>;
}

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseFieldManagementProps {
  formId: string;
}