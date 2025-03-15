import { useCallback, useEffect, useRef, useState } from 'react';

import { FORM_MODAL_TEXT, FORM_VALIDATION_ERRORS, FormOperations } from '@/constants/form';
import { useForm } from '@/hooks/form/useForm';
import { useCreateFormMutation, useUpdateFormMutation } from '@/lib/redux/slices/apiSlice';
import { Form } from '@/types/api';
import { FormModalMode, FormModalProps, FormValues } from '@/types/form';

export const useFormModal = ({ 
  isOpen, 
  onClose, 
  mode = FormModalMode.CREATE,
  initialForm = {} 
}: FormModalProps) => {
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const isUpdateMode = mode === FormModalMode.UPDATE;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formInitialized = useRef(false);
  
  const handleFormSubmit = useCallback(async (values: FormValues) => {
    setSubmitError(null);
    
    try {
      const formData = {
        name: values.name,
        isVisible: values.isVisible,
        isReadOnly: values.isReadOnly,
        fields: initialForm.fields || []
      };
      
      if (isUpdateMode && initialForm?._id) {
        await updateForm({ ...formData, _id: initialForm._id } as Form).unwrap();
      } else {
        await createForm(formData as Omit<Form, '_id'>).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? FormOperations.UPDATING : FormOperations.CREATING} form:`, error);
      setSubmitError(FORM_VALIDATION_ERRORS.SUBMIT_ERROR(isUpdateMode));
    }
  }, [isUpdateMode, initialForm, createForm, updateForm, onClose]);
  
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues
  } = useForm<FormValues>({
    initialValues: {
      name: initialForm?.name || '',
      isVisible: initialForm?.isVisible ?? true,
      isReadOnly: initialForm?.isReadOnly ?? false
    },
    onSubmit: handleFormSubmit,
    validate: (values: FormValues) => {
      const errors: Partial<Record<keyof FormValues, string>> = {};
      
      if (!values.name.trim()) {
        errors.name = 'Form name is required';
      }
      
      return errors;
    }
  });
  
  useEffect(() => {
    if (isOpen) {
      // When modal opens or initialForm changes, update form values
      if (initialForm?._id && !formInitialized.current) {
        setValues({
          name: initialForm?.name || '',
          isVisible: initialForm?.isVisible ?? true,
          isReadOnly: initialForm?.isReadOnly ?? false
        });
        formInitialized.current = true;
      }
    } else {
      // When modal closes, reset the initialization flag
      formInitialized.current = false;
      setSubmitError(null);
    }
  }, [isOpen, initialForm, setValues]);
  
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