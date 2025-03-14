import { FormEvent, ChangeEvent } from "react";

import { FieldFormValues, FormField, FormModalMode, FormValues } from "@/types/form";

export interface FormModalContentProps {
        values: FormValues;
        errors: Record<string, string>;
        handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
        isViewOnly: boolean;
        formFields: FormField[];
        handleOpenFieldModal: () => void;
        handleDeleteField?: (fieldId: string) => void;
        submitError: string | null;
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
