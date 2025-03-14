import { Form } from '@/lib/redux/slices/formsSlice';

/**
 * Field type enum for different form field types
 */
export enum FieldType {
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email'
}

/**
 * Field interface for form fields
 */
export interface FormField {
  id: string;
  formId: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For dropdown and radio fields
  defaultValue?: string | boolean | number;
}

/**
 * Field values for the field form
 */
export interface FieldFormValues {
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string;
  defaultValue?: string;
}

/**
 * Modal mode enum to identify create, update, or view operations
 */
export enum FormModalMode {
  CREATE = 'create',
  UPDATE = 'update',
  VIEW = 'view'
}

/**
 * Form modal props interface
 */
export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormModalMode;
  initialForm?: Partial<Form>;
}

/**
 * Form value structure for the form inputs
 */
export interface FormValues {
  title: string;
  isVisible: boolean;
  isReadOnly: boolean;
}

/**
 * Modal state interface for the FormList component
 */
export interface FormModalState {
  isOpen: boolean;
  mode: FormModalMode;
  selectedFormId: string | null;
}

/**
 * Field modal props interface
 */
export interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  onSave: (field: FieldFormValues) => void;
}

// Re-export Form type from redux slice for convenience
export type { Form }; 