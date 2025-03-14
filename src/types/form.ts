import { Form } from '@/types/hook';

export interface ModalState {
  isOpen: boolean;
  mode: FormModalMode;
  selectedFormId: string | null;
}

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

export interface FieldFormValues {
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string;
  defaultValue?: string;
}

export enum FormModalMode {
  CREATE = 'creating',
  UPDATE = 'updating',
  VIEW = 'viewing'
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormModalMode;
  initialForm?: Partial<Form>;
}

export interface FormValues {
  title: string;
  isVisible: boolean;
  isReadOnly: boolean;
}

export interface FormModalState {
  isOpen: boolean;
  mode: FormModalMode;
  selectedFormId: string | null;
}

export interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId?: string;
  onSave: (field: FieldFormValues) => void;
}

export type { Form }; 