'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FORM_SUBMIT_ERRORS } from '@/constants/form';
import { FormOperations } from '@/constants/formConstants';
import { useForm } from '@/hooks/form/useForm';
import { useFieldManagement } from '@/hooks/useFieldManagement';
import { useFormMode } from '@/hooks/useFormMode';
import { useModalState } from '@/hooks/useModalState';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectFieldsByFormId } from '@/lib/redux/slices/fieldsSlice';
import { addForm, selectAllForms, updateForm } from '@/lib/redux/slices/formsSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { FormModalMode, FormModalProps, FormValues } from '@/types/form';
import { extractFormValues, prepareFormData } from '@/utils/form';
import { FormIdManager } from '@/utils/formIdManager';
import { validateForm } from '@/utils/validation';

import { FormModalRenderer } from '../FormModalContent/FormModalRenderer';

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
  const dispatch = useDispatch<AppDispatch>();
  
  // Create a temporary ID for new forms in create mode
  const tempFormIdRef = useRef<string>(FormIdManager.generateId());
  
  // Track previous mode and form ID for change detection
  const prevMode = useRef<FormModalMode>(mode);
  const prevFormId = useRef<string | undefined>(initialForm?.id);
  
  // Get form error state
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Get all existing forms for uniqueness validation
  const allForms = useAppSelector(selectAllForms);
  
  // Extract initial values from the form
  const initialValues = useMemo(() => {
    // For create mode or if no initialForm, return default empty values
    if (mode === FormModalMode.CREATE || !initialForm?.id) {
      return { ...DEFAULT_FORM_VALUES };
    }
    // For update mode, extract values from the form
    return extractFormValues(initialForm);
  }, [mode, initialForm?.id]);
  
  // Get form mode information
  const { isUpdateMode, isViewOnly } = useFormMode({ mode, initialValues });
  
  // Get fields for this form
  const formFields = useSelector((state: RootState) => 
    selectFieldsByFormId(state, isUpdateMode && initialForm?.id ? initialForm.id : tempFormIdRef.current)
  );
  
  // Manage field modal state
  const fieldModal = useModalState(false);
  
  // Get field management functions
  const formId = isUpdateMode && initialForm?.id ? initialForm.id : tempFormIdRef.current;
  const { addFieldToForm, deleteFieldFromForm } = useFieldManagement({ formId });

  // Form validation function
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
        await dispatch(updateForm({
          id: initialForm.id,
          ...formData
        }));
      } else {
        // Create new form
        await dispatch(addForm(formData));
        // Generate a new ID for the form fields
        const newFormId = FormIdManager.generateId();
        
        // Save any fields that were added during form creation
        FormIdManager.saveFieldsForNewForm(dispatch, tempFormIdRef.current, formFields, newFormId);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? FormOperations.UPDATING : FormOperations.CREATING} form:`, error);
      setSubmitError(isUpdateMode ? FORM_SUBMIT_ERRORS.UPDATE_FAILED : FORM_SUBMIT_ERRORS.CREATE_FAILED);
      throw error; // Let the form hook handle the error
    }
  }, [isUpdateMode, initialForm?.id, dispatch, onClose, formFields]);
  
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
    
    // Clean up temporary fields if in create mode
    if (!isUpdateMode) {
      FormIdManager.cleanupTemporaryFields(dispatch, tempFormIdRef.current);
      // Generate a new temporary ID for next time
      tempFormIdRef.current = FormIdManager.generateId();
    }
    
    onClose();
  }, [onClose, resetForm, isUpdateMode, dispatch]);
  
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
        // Generate a new temporary ID for create mode
        tempFormIdRef.current = FormIdManager.generateId();
      } else if (mode === FormModalMode.UPDATE || mode === FormModalMode.VIEW) {
        // For both update and view modes, extract values from the form
        const formValues = extractFormValues(initialForm);
        setValues(formValues);
      }
    }
  }, [isOpen, mode, initialForm?.id, setValues, resetForm]);
  
  return (
    <FormModalRenderer 
      isOpen={isOpen}
      onClose={handleModalClose}
      mode={mode}
      isViewOnly={isViewOnly}
      isSubmitting={isSubmitting}
      values={values}
      errors={errors}
      formFields={formFields}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleOpenFieldModal={fieldModal.open}
      handleDeleteField={deleteFieldFromForm}
      submitError={submitError}
      isFieldModalOpen={fieldModal.isOpen}
      handleCloseFieldModal={fieldModal.close}
      handleSaveField={addFieldToForm}
      formId={formId}
    />
  );
}; 