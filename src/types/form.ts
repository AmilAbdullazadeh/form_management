import { Form } from '@/lib/redux/slices/formsSlice';

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

// Re-export Form type from redux slice for convenience
export type { Form }; 