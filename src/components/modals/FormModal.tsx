'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Checkbox, ErrorMessage, Input, Modal } from '@/components/common';
import { FORM_MODAL_TEXT, FORM_SUBMIT_ERRORS, FORM_FIELD_LABELS, FORM_FIELD_PLACEHOLDERS } from '@/constants/form';
import { useForm } from '@/hooks';
import { useCreateFormMutation, useUpdateFormMutation, useGetFormsQuery } from '@/lib/redux/slices/apiSlice';
import { Form } from '@/types/api';
import { FormModalMode, FormModalProps, FormValues } from '@/types/form';
import { validateFormName } from '@/utils/validation';

import styles from './FormModal.module.scss';

const DEFAULT_FORM_VALUES: FormValues = {
  name: '',
  isVisible: true,
  isReadOnly: false
};

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  mode = FormModalMode.CREATE,
  initialForm = {}
}) => {
  const { data: forms = [] } = useGetFormsQuery();
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const isUpdateMode = mode === FormModalMode.UPDATE;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prevMode = useRef<FormModalMode>(mode);
  const prevFormId = useRef<string | undefined>(initialForm?._id);
  
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
  
  // Check if the form is in view-only mode (either VIEW mode or readonly form in UPDATE mode)
  const isViewOnly = mode === FormModalMode.VIEW || (isUpdateMode && initialValues.isReadOnly);

  const validateFormValues = useCallback((values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    
    // Validate form name
    const nameValidation = validateFormName(
      values.name, 
      forms, 
      isUpdateMode ? initialForm?._id : undefined
    );
    
    if (!nameValidation.isValid && nameValidation.error) {
      errors.name = nameValidation.error;
    }
    
    return errors;
  }, [forms, isUpdateMode, initialForm?._id]);
  
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
      console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} form:`, error);
      setSubmitError(isUpdateMode ? FORM_SUBMIT_ERRORS.UPDATE_FAILED : FORM_SUBMIT_ERRORS.CREATE_FAILED);
    }
  }, [isUpdateMode, initialForm, createForm, updateForm, onClose]);
  
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
    onClose();
  }, [onClose, resetForm]);
  
  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null);
      resetForm();
      return;
    }

    const modeChanged = prevMode.current !== mode;
    const formIdChanged = prevFormId.current !== initialForm?._id;
    
    // Only update if there's a relevant change
    if (modeChanged || formIdChanged) {
      prevMode.current = mode;
      prevFormId.current = initialForm?._id;
      setSubmitError(null);
      
      if (mode === FormModalMode.CREATE) {
        setValues({ ...DEFAULT_FORM_VALUES });
      } else if (mode === FormModalMode.UPDATE && initialForm?._id) {
        setValues({
          name: initialForm.name || '',
          isVisible: initialForm.isVisible ?? true,
          isReadOnly: initialForm.isReadOnly ?? false
        });
      }
    }
  }, [isOpen, mode, initialForm, setValues, resetForm]);
  
  // Modal title and submit button text based on mode
  const modalTitle = FORM_MODAL_TEXT[mode].TITLE;
  const submitButtonText = FORM_MODAL_TEXT[mode].SUBMIT_BUTTON;
  
  // Modal footer with action buttons - hide submit button in view-only mode
  const modalFooter = (
    <>
      <Button 
        variant="outline" 
        onClick={handleModalClose} 
        disabled={isSubmitting}
      >
        {isViewOnly ? 'Close' : FORM_MODAL_TEXT.CANCEL_BUTTON}
      </Button>
      {!isViewOnly && (
        <Button 
          type="submit"
          form="form-modal"
          isLoading={isSubmitting}
        >
          {submitButtonText}
        </Button>
      )}
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isViewOnly ? 'Form Details' : modalTitle}
      footer={modalFooter}
      >
        <div className={`${styles.formContainer} ${isViewOnly ? styles.readOnlyForm : ''}`}>
          <form id="form-modal" onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <Input
                id="name"
                name="name"
                label={FORM_FIELD_LABELS.FORM_NAME}
                value={values.name}
                onChange={handleChange}
                placeholder={FORM_FIELD_PLACEHOLDERS.FORM_NAME}
                error={errors.name}
                fullWidth
                required
                autoFocus
                disabled={isViewOnly}
              />
            </div>
            
            <div className={styles.checkboxGroup}>
              <Checkbox
                id="isVisible"
                name="isVisible"
                label={FORM_FIELD_LABELS.VISIBLE}
                checked={values.isVisible}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              
              <Checkbox
                id="isReadOnly"
                name="isReadOnly"
                label={FORM_FIELD_LABELS.READ_ONLY}
                checked={values.isReadOnly}
                onChange={handleChange}
                disabled={isViewOnly}
              />
            </div>
            
            {submitError && (
              <div className={styles.submitError}>
                <ErrorMessage message={submitError} />
              </div>
            )}
          </form>
        </div>
      </Modal>
  );
}; 