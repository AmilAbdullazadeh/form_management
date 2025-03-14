import { useCallback, useEffect, useRef, useState } from 'react';

import { FORM_VALIDATION_ERRORS } from '@/constants/form';
import { useForm } from '@/hooks/form/useForm';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addForm, updateForm } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, FormModalProps, FormValues } from '@/types/form';
import { generateFormDescription, getInitialFormValues } from '@/utils/form';
import { validateForm } from '@/utils/validation';

/**
 * Custom hook for form modal logic
 * 
 * @param props - The modal props
 * @returns Form state, handlers, and UI elements for the form modal
 */
export const useFormModal = ({ 
  isOpen, 
  onClose, 
  mode = FormModalMode.CREATE,
  initialForm = {} 
}: FormModalProps) => {
  const dispatch = useAppDispatch();
  const isUpdateMode = mode === 'update';
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formInitialized = useRef(false);
  
  // Handle form submission
  const handleFormSubmit = useCallback(async (values: FormValues) => {
    // Clear any previous submit errors
    setSubmitError(null);
    
    try {
      const formData = {
        title: values.title,
        description: generateFormDescription(values),
      };
      
      if (isUpdateMode && initialForm?.id) {
        // Update existing form
        dispatch(updateForm({
          id: initialForm.id,
          ...formData
        }));
      } else {
        // Create new form
        dispatch(addForm(formData));
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} form:`, error);
      setSubmitError(FORM_VALIDATION_ERRORS.SUBMIT_ERROR(isUpdateMode));
      throw error; // Let the form hook handle the error
    }
  }, [isUpdateMode, initialForm?.id, dispatch, onClose]);
  
  // Initialize form with useForm hook
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues
  } = useForm<FormValues>({
    initialValues: getInitialFormValues(initialForm),
    onSubmit: handleFormSubmit,
    validate: (values: FormValues) => validateForm(values, forms, currentFormId)
  });
  
  // Handle initialForm changes and modal open/close
  useEffect(() => {
    if (isOpen) {
      // When modal opens or initialForm changes, update form values
      if (isUpdateMode && initialForm?.id && !formInitialized.current) {
        const values = getInitialFormValues(initialForm);
        setValues(values);
        formInitialized.current = true;
      } else if (!isUpdateMode) {
        // For create mode, just reset to defaults
        setValues(getInitialFormValues());
      }
    } else {
      // When modal closes, reset the initialization flag
      formInitialized.current = false;
      setSubmitError(null);
    }
  }, [isOpen, isUpdateMode, initialForm?.id, initialForm?.title, initialForm?.description, setValues]);
  
  // Return form state and handlers
  return {
    // Form state
    values,
    errors,
    isSubmitting,
    submitError,
    isUpdateMode,
    
    // Form handlers
    handleChange,
    handleSubmit,
    
    // Helper getters
    modalTitle: isUpdateMode ? 'Update Form' : 'Create Form',
    submitButtonText: isUpdateMode ? 'Save Changes' : 'Create',
  };
}; 