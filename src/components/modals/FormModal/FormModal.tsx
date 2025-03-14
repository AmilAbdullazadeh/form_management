'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { FORM_MODAL_TEXT, FORM_SUBMIT_ERRORS } from '@/constants/form';
import { useForm } from '@/hooks/useForm';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addField, selectFieldsByFormId } from '@/lib/redux/slices/fieldsSlice';
import { addForm, selectAllForms, updateForm } from '@/lib/redux/slices/formsSlice';
import { FieldFormValues, FormModalMode, FormModalProps, FormValues } from '@/types/form';
import { extractFormValues, prepareFormData } from '@/utils/form';
import { validateForm } from '@/utils/validation';

import { FieldModal } from '../FieldModal/FieldModal';
import { FormContent } from '../FormModalContent/FormModalContent';

import styles from './FormModal.module.scss';


// Default empty form values
const DEFAULT_FORM_VALUES: FormValues = {
  title: '',
  isVisible: true,
  isReadOnly: false
};

/**
 * Reusable modal component for creating or updating forms
 * Handles both create and edit modes with proper state management
 */
export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  mode = FormModalMode.CREATE,
  initialForm = {}
}) => {
  const dispatch = useAppDispatch();
  const isUpdateMode = mode === FormModalMode.UPDATE;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prevMode = useRef<FormModalMode>(mode);
  const prevFormId = useRef<string | undefined>(initialForm?.id);
  
  // Field modal state
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  
  // Get all existing forms for uniqueness validation
  const allForms = useAppSelector(selectAllForms);
  
  // Get fields for this form if in update mode
  const formFields = useAppSelector(state => 
    isUpdateMode && initialForm?.id 
      ? selectFieldsByFormId(state, initialForm.id) 
      : []
  );
  
  // Extract initial values from the form once using useMemo to prevent recreation on every render
  const initialValues = useMemo(() => {
    // For create mode or if no initialForm, return default empty values
    if (mode === FormModalMode.CREATE || !initialForm?.id) {
      return { ...DEFAULT_FORM_VALUES };
    }
    // For update mode, extract values from the form
    return extractFormValues(initialForm);
  }, [mode, initialForm?.id]);
  
  // Check if the form is in view-only mode (either VIEW mode or readonly form in UPDATE mode)
  const isViewOnly = mode === FormModalMode.VIEW || (isUpdateMode && initialValues.isReadOnly);

  // Form validation function that uses the utility
  const validateFormValues = useCallback((values: FormValues) => {
    return validateForm(values, allForms, isUpdateMode ? initialForm?.id : undefined);
  }, [allForms, isUpdateMode, initialForm?.id]);
  
  // Handle form submission
  const handleFormSubmit = useCallback(async (values: FormValues) => {
    // Clear any previous submit errors
    setSubmitError(null);
    
    try {
      const formData = prepareFormData(values);
      
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
      setSubmitError(isUpdateMode ? FORM_SUBMIT_ERRORS.UPDATE_FAILED : FORM_SUBMIT_ERRORS.CREATE_FAILED);
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
  
  // Handle opening the field modal
  const handleOpenFieldModal = useCallback(() => {
    setIsFieldModalOpen(true);
  }, []);

  // Handle closing the field modal
  const handleCloseFieldModal = useCallback(() => {
    setIsFieldModalOpen(false);
  }, []);

  // Handle saving a new field
  const handleSaveField = useCallback((fieldValues: FieldFormValues) => {
    if (isUpdateMode && initialForm?.id) {
      // Process options string into array if needed
      const options = fieldValues.options?.split(',').map(opt => opt.trim()).filter(Boolean);
      
      // Add the field to the form
      dispatch(addField({
        formId: initialForm.id,
        type: fieldValues.type,
        label: fieldValues.label,
        placeholder: fieldValues.placeholder,
        required: fieldValues.required,
        options: options,
        defaultValue: fieldValues.defaultValue
      }));
    }
  }, [dispatch, isUpdateMode, initialForm?.id]);
  
  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null);
      resetForm();
      return;
    }

    const modeChanged = prevMode.current !== mode;
    const formIdChanged = prevFormId.current !== initialForm?.id;
    
    // Only update if there's a relevant change
    if (modeChanged || formIdChanged) {
      prevMode.current = mode;
      prevFormId.current = initialForm?.id;
      setSubmitError(null);
      
      if (mode === FormModalMode.CREATE) {
        setValues({ ...DEFAULT_FORM_VALUES });
      } else if (mode === FormModalMode.UPDATE && initialForm?.id) {
        setValues(extractFormValues(initialForm));
      }
    }
  }, [isOpen, mode, initialForm?.id, setValues, resetForm]);
  
  // Modal title and submit button text based on mode
  const modalTitle = isViewOnly ? FORM_MODAL_TEXT[FormModalMode.VIEW].TITLE : FORM_MODAL_TEXT[mode].TITLE;
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
      title={modalTitle}
      footer={modalFooter}
    >
      <div className={`${styles.formContainer} ${isViewOnly ? styles.readOnlyForm : ''}`}>
        <form id="form-modal" onSubmit={handleSubmit} noValidate>
          <FormContent 
            values={values}
            errors={errors}
            handleChange={handleChange}
            isViewOnly={isViewOnly}
            formFields={formFields}
            isUpdateMode={isUpdateMode}
            initialForm={initialForm}
            handleOpenFieldModal={handleOpenFieldModal}
            submitError={submitError}
          />
        </form>
      </div>
      
      {/* Field Modal */}
      {isUpdateMode && initialForm?.id && (
        <FieldModal
          isOpen={isFieldModalOpen}
          onClose={handleCloseFieldModal}
          onSave={handleSaveField}
        />
      )}
    </Modal>
  );
}; 