import { FormEvent, ChangeEvent } from "react";

import { FormField } from "@/types/api";
import { FormModalMode } from "@/types/form";

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
  handleSaveField: (field: FormField) => void;
  formId: string;
} 