import { FormEvent, ChangeEvent } from "react";

import { FieldFormValues } from "@/hooks/form/useFieldForm";
import { FormField } from "@/lib/redux/slices/apiSlice";

export enum FormModalMode {
  CREATE = 'creating',
  UPDATE = 'updating',
  VIEW = 'viewing'
}

export interface FormValues {
  name: string;
  isVisible: boolean;
  isReadOnly: boolean;
}

export interface FormModalContentProps {
  values: FormValues;
  errors: Record<string, string>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  isViewOnly: boolean;
  formFields: FormField[];
  handleOpenFieldModal: () => void;
  handleDeleteField?: (fieldName: string) => void;
  submitError: string | null;
  reorderFormFields?: (fields: FormField[]) => void;
}

export interface FormModalRenderProps extends FormModalContentProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormModalMode;
  isSubmitting: boolean;
  handleSubmit: (e: FormEvent) => void;
  isFieldModalOpen: boolean;
  handleCloseFieldModal: () => void;
  handleSaveField: (field: FieldFormValues) => void;
  formId: string;
} 