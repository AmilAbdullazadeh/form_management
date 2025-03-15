import { Form } from '@/lib/redux/slices/apiSlice';

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

export interface FormModalState {
  isOpen: boolean;
  mode: FormModalMode;
  selectedFormId: string | null;
} 