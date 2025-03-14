'use client';

import { useMemo } from 'react';

import { FormModalMode, FormValues } from '@/types/form';

interface UseFormModeProps {
  mode: FormModalMode;
  initialValues: FormValues;
}

/**
 * Custom hook for managing form modes and related states
 * Determines view-only status and other mode-specific behaviors
 */
export const useFormMode = ({ mode, initialValues }: UseFormModeProps) => {
  // Determine if we're in update mode
  const isUpdateMode = useMemo(() => mode === FormModalMode.UPDATE, [mode]);
  
  // Determine if the form is in view-only mode (either VIEW mode or readonly form in UPDATE mode)
  const isViewOnly = useMemo(() => 
    mode === FormModalMode.VIEW || (isUpdateMode && initialValues.isReadOnly),
  [mode, isUpdateMode, initialValues.isReadOnly]);

  return {
    isUpdateMode,
    isViewOnly,
    isCreateMode: mode === FormModalMode.CREATE,
    isViewMode: mode === FormModalMode.VIEW
  };
}; 