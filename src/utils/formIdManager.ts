'use client';

import { v4 as uuidv4 } from 'uuid';

import { addField, deleteFormFields } from '@/lib/redux/slices/fieldsSlice';
import { AppDispatch } from '@/lib/redux/store';
import { FormField } from '@/types/form';

/**
 * Utility for managing form IDs and related operations
 * Encapsulates ID generation and field management logic
 */
export const FormIdManager = {
  /**
   * Generate a new unique ID
   */
  generateId: (): string => {
    return uuidv4();
  },

  /**
   * Save fields for a new form by transferring them from a temporary ID to the permanent one
   */
  saveFieldsForNewForm: (
    dispatch: AppDispatch, 
    tempFormId: string, 
    formFields: FormField[], 
    newFormId: string
  ): void => {
    if (formFields.length > 0) {
      // First delete the temporary fields
      dispatch(deleteFormFields(tempFormId));
      
      // Then add them with the correct formId
      formFields.forEach(field => {
        // Create a new field object without the id
        dispatch(addField({
          formId: newFormId,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          defaultValue: field.defaultValue
        }));
      });
    }
  },

  /**
   * Clean up temporary fields
   */
  cleanupTemporaryFields: (dispatch: AppDispatch, tempFormId: string): void => {
    dispatch(deleteFormFields(tempFormId));
  }
}; 