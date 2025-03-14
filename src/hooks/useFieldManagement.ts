'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addField, deleteField } from '@/lib/redux/slices/fieldsSlice';
import { AppDispatch } from '@/lib/redux/store';
import { FieldFormValues } from '@/types/form';
import { UseFieldManagementProps } from '@/types/hook';


/**
 * Custom hook for managing form fields (add, delete, etc.)
 * Encapsulates field-related operations to keep components cleaner
 */
export const useFieldManagement = ({ formId }: UseFieldManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Add a new field to the form
   */
  const addFieldToForm = useCallback((fieldValues: FieldFormValues) => {
    // Process options string into array if needed
    const options = fieldValues.options?.split(',').map(opt => opt.trim()).filter(Boolean);
    
    // Add the field to the form
    dispatch(addField({
      formId,
      type: fieldValues.type,
      label: fieldValues.label,
      placeholder: fieldValues.placeholder,
      required: fieldValues.required,
      options: options,
      defaultValue: fieldValues.defaultValue
    }));
  }, [dispatch, formId]);

  /**
   * Delete a field from the form
   */
  const deleteFieldFromForm = useCallback((fieldId: string) => {
    if (fieldId) {
      dispatch(deleteField(fieldId));
    }
  }, [dispatch]);

  return {
    addFieldToForm,
    deleteFieldFromForm
  };
}; 