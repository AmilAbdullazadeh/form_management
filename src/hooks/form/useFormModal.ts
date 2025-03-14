import { useCallback, useEffect, useRef, useState } from 'react';

import { FORM_MODAL_TEXT, FORM_VALIDATION_ERRORS } from '@/constants/form';
import { useForm } from '@/hooks/form/useForm';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addForm, updateForm } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, FormModalProps, FormValues } from '@/types/form';
import { generateFormDescription, getInitialFormValues } from '@/utils/form';
import { validateForm } from '@/utils/validation';

/**
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
  const isUpdateMode = mode === FormModalMode.UPDATE;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formInitialized = useRef(false);
  
  const handleFormSubmit = useCallback(async (values: FormValues) => {
    setSubmitError(null);
    
    try {
      const formData = {
        title: values.title,
        description: generateFormDescription(values),
      };
      
      if (isUpdateMode && initialForm?.id) {
        dispatch(updateForm({
          id: initialForm.id,
          ...formData
        }));
      } else {
        dispatch(addForm(formData));
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} form:`, error);
      setSubmitError(FORM_VALIDATION_ERRORS.SUBMIT_ERROR(isUpdateMode));
      throw error;
    }
  }, [isUpdateMode, initialForm?.id, dispatch, onClose]);
  
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
  
  useEffect(() => {
    if (isOpen) {
      // When modal opens or initialForm changes, update form values
      if (isUpdateMode && initialForm?.id && !formInitialized.current) {
        const values = getInitialFormValues(initialForm);
        setValues(values);
        formInitialized.current = true;
      } else if (!isUpdateMode) {
        setValues(getInitialFormValues());
      }
    } else {
      // When modal closes, reset the initialization flag
      formInitialized.current = false;
      setSubmitError(null);
    }
  }, [isOpen, isUpdateMode, initialForm?.id, initialForm?.title, initialForm?.description, setValues]);
  
  return {
    values,
    errors,
    isSubmitting,
    submitError,
    isUpdateMode,
    handleChange,
    handleSubmit,
    modalTitle: isUpdateMode ? FORM_MODAL_TEXT[FormModalMode.UPDATE].TITLE : FORM_MODAL_TEXT[FormModalMode.CREATE].TITLE,
    submitButtonText: isUpdateMode ? FORM_MODAL_TEXT[FormModalMode.UPDATE].SUBMIT_BUTTON : FORM_MODAL_TEXT[FormModalMode.CREATE].SUBMIT_BUTTON,
  };
}; 