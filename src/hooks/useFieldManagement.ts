'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addField, deleteField, reorderFields } from '@/lib/redux/slices/fieldsSlice';
import { AppDispatch } from '@/lib/redux/store';
import { FieldFormValues, FormField } from '@/types/form';
import { UseFieldManagementProps } from '@/types/hook';


/**
 * Managing form fields (add, delete, reorder, etc.)
 */
export const useFieldManagement = ({ formId }: UseFieldManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const addFieldToForm = useCallback((fieldValues: FieldFormValues) => {
    const options = fieldValues.options?.split(',').map(opt => opt.trim()).filter(Boolean);
    
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

  const deleteFieldFromForm = useCallback((fieldId: string) => {
    if (fieldId) {
      dispatch(deleteField(fieldId));
    }
  }, [dispatch]);

  const reorderFormFields = useCallback((fields: FormField[]) => {
    const fieldIds = fields.map(field => field.id);
    dispatch(reorderFields({ formId, fieldIds }));
  }, [dispatch, formId]);

  return {
    addFieldToForm,
    deleteFieldFromForm,
    reorderFormFields
  };
}; 