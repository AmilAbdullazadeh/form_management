'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FormModalMode, FormValues } from '@/components/modals/FormModalContent/types';
import { FORM_SUBMIT_ERRORS, FormOperations } from '@/constants/form';
import { useForm } from '@/hooks/form/useForm';
import { useFormMode } from '@/hooks/useFormMode';
import { useModalState } from '@/hooks/useModalState';
import { Form, FormField, useCreateFormMutation, useUpdateFormMutation } from '@/lib/redux/slices/apiSlice';

import { FormModalRenderer } from '../FormModalContent/FormModalRenderer';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormModalMode;
  initialForm?: Partial<Form>;
}

export interface FormModalState {
  isOpen: boolean;
  mode: FormModalMode;
  selectedFormId: string | null;
}

const DEFAULT_FORM_VALUES: FormValues = {
  name: '',
  isVisible: true,
  isReadOnly: false
};

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  mode = FormModalMode.CREATE,
  initialForm
}) => {
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const [fields, setFields] = useState<FormField[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Determine initial values based on mode
  const initialValues = useMemo(() => {
    if (mode === FormModalMode.CREATE || !initialForm?._id) {
      return { ...DEFAULT_FORM_VALUES };
    }
    
    return {
      name: initialForm.name || '',
      isVisible: initialForm.isVisible ?? true,
      isReadOnly: initialForm.isReadOnly ?? false
    };
  }, [mode, initialForm]);
  
  const { isUpdateMode, isViewOnly } = useFormMode({ mode, initialValues });
  
  const fieldModal = useModalState(false);
  
  const addFieldToForm = useCallback((field: FormField) => {
    setFields(prev => [...prev, field]);
  }, []);
  
  const deleteFieldFromForm = useCallback((fieldName: string) => {
    setFields(prev => prev.filter(field => field.name !== fieldName));
  }, []);
  
  const reorderFormFields = useCallback((reorderedFields: FormField[]) => {
    setFields(reorderedFields);
  }, []);
  
  const validateFormValues = useCallback(
    (values: FormValues) => {
      const errors: Partial<Record<keyof FormValues, string>> = {};
      
      if (!values.name.trim()) {
        errors.name = 'Form name is required';
      }
      
      return errors;
    },
    []
  );
  
  const handleFormSubmit = useCallback(async (values: FormValues) => {
    setSubmitError(null);
    
    try {
      const formData = {
        ...values,
        fields
      };
      
      if (isUpdateMode && initialForm?._id) {
        await updateForm({ ...formData, _id: initialForm._id } as Form).unwrap();
      } else {
        await createForm(formData as Omit<Form, '_id'>).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? FormOperations.UPDATING : FormOperations.CREATING} form:`, error);
      setSubmitError(isUpdateMode ? FORM_SUBMIT_ERRORS.UPDATE_FAILED : FORM_SUBMIT_ERRORS.CREATE_FAILED);
      throw error;
    }
  }, [isUpdateMode, initialForm, createForm, updateForm, onClose, fields]);
  
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    resetForm
  } = useForm<FormValues>({
    initialValues,
    onSubmit: handleFormSubmit,
    validate: validateFormValues
  });
  
  // Handle modal close with cleanup
  const handleModalClose = useCallback(() => {
    setSubmitError(null);
    resetForm();
    setFields([]);
    onClose();
  }, [onClose, resetForm]);
  
  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null);
      resetForm();
      setFields([]);
      return;
    }

    if (initialForm?.fields) {
      setFields(initialForm.fields);
    }
    
    setValues({
      name: initialForm?.name || '',
      isVisible: initialForm?.isVisible ?? true,
      isReadOnly: initialForm?.isReadOnly ?? false
    });
  }, [isOpen, initialForm, setValues, resetForm]);
  
  return (
    <FormModalRenderer 
      isOpen={isOpen}
      onClose={handleModalClose}
      mode={mode}
      isViewOnly={isViewOnly}
      isSubmitting={isSubmitting}
      values={values}
      errors={errors}
      formFields={fields}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleOpenFieldModal={fieldModal.open}
      handleDeleteField={deleteFieldFromForm}
      reorderFormFields={reorderFormFields}
      submitError={submitError}
      isFieldModalOpen={fieldModal.isOpen}
      handleCloseFieldModal={fieldModal.close}
      handleSaveField={addFieldToForm}
      formId={initialForm?._id || ''}
    />
  );
}; 