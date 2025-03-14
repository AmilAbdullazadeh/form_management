'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FORM_SUBMIT_ERRORS, FormOperations } from '@/constants/form';
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

const DEFAULT_FORM_VALUES: FormValues = {
  title: '',
  isVisible: true,
  isReadOnly: false
};

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  mode = FormModalMode.CREATE,
  initialForm = {}
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const tempFormIdRef = useRef<string>(FormIdManager.generateId());
  const prevMode = useRef<FormModalMode>(mode);
  const prevFormId = useRef<string | undefined>(initialForm?.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const allForms = useAppSelector(selectAllForms);
  
  // Determine initial values based on mode
  const initialValues = useMemo(() => 
    (mode === FormModalMode.CREATE || !initialForm?.id) 
      ? { ...DEFAULT_FORM_VALUES } 
      : extractFormValues(initialForm),
  [mode, initialForm?.id]);
  
  const { isUpdateMode, isViewOnly } = useFormMode({ mode, initialValues });
  
  const formId = isUpdateMode && initialForm?.id ? initialForm.id : tempFormIdRef.current;
  const formFields = useSelector((state: RootState) => selectFieldsByFormId(state, formId));
  const fieldModal = useModalState(false);
  const { addFieldToForm, deleteFieldFromForm } = useFieldManagement({ formId });

  const validateFormValues = useCallback(
    (values: FormValues) => validateForm(values, allForms, isUpdateMode ? initialForm?.id : undefined),
    [allForms, isUpdateMode, initialForm?.id]
  );
  
  const handleFormSubmit = useCallback(async (values: FormValues) => {
    setSubmitError(null);
    
    try {
      const formData = prepareFormData(values);
      
      if (isUpdateMode && initialForm?.id) {
        await dispatch(updateForm({ id: initialForm.id, ...formData }));
      } else {
        await dispatch(addForm(formData));
        const newFormId = FormIdManager.generateId();
        FormIdManager.saveFieldsForNewForm(dispatch, tempFormIdRef.current, formFields, newFormId);
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? FormOperations.UPDATING : FormOperations.CREATING} form:`, error);
      setSubmitError(isUpdateMode ? FORM_SUBMIT_ERRORS.UPDATE_FAILED : FORM_SUBMIT_ERRORS.CREATE_FAILED);
      throw error;
    }
  }, [isUpdateMode, initialForm?.id, dispatch, onClose, formFields]);
  
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
    
    if (!isUpdateMode) {
      FormIdManager.cleanupTemporaryFields(dispatch, tempFormIdRef.current);
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
    
    if (modeChanged || formIdChanged) {
      prevMode.current = mode;
      prevFormId.current = initialForm?.id;
      setSubmitError(null);
      
      if (mode === FormModalMode.CREATE) {
        setValues({ ...DEFAULT_FORM_VALUES });
        tempFormIdRef.current = FormIdManager.generateId();
      } else {
        setValues(extractFormValues(initialForm));
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