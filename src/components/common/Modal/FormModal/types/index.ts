import { ReactNode } from "react";

export interface FormModalProps {
    title: string;
    formContent: ReactNode;
    onSubmit: () => Promise<void>;
    submitLabel?: string;
    cancelLabel?: string;
    size?: 'sm' | 'md' | 'lg';
    isSubmitting?: boolean;
  }