'use client';

import { FormModalMode, FormValues } from '@/types/form';

interface UseFormModeProps {
  mode: FormModalMode;
  initialValues: FormValues;
}

export const useFormMode = ({ mode, initialValues }: UseFormModeProps) => {
  const isUpdateMode = mode === FormModalMode.UPDATE;
  const isViewOnly = mode === FormModalMode.VIEW || (isUpdateMode && initialValues.isReadOnly);

  return {
    isUpdateMode,
    isViewOnly,
    isCreateMode: mode === FormModalMode.CREATE,
    isViewMode: mode === FormModalMode.VIEW
  };
}; 