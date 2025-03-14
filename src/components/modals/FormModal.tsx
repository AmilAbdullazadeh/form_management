'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import {
  FORM_MODAL_TEXT,
  FORM_SUBMIT_ERRORS,
  FORM_FIELD_LABELS,
  FORM_FIELD_PLACEHOLDERS,
} from '@/constants/form';
import { useForm } from '@/hooks/useForm';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addForm, selectAllForms, updateForm } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, FormModalProps, FormValues } from '@/types/form';
import { extractFormValues, prepareFormData } from '@/utils/form';
import { validateForm } from '@/utils/validation';

import styles from './FormModal.module.scss';

// Default empty form values
const DEFAULT_FORM_VALUES: FormValues = {
  title: '',
  isVisible: true,
  isReadOnly: false,
};

/**
 * Reusable modal component for creating or updating forms
 * Handles both create and edit modes with proper state management
 */
export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  mode = FormModalMode.CREATE,
  initialForm = {},
}) => {
  const dispatch = useAppDispatch();
  const isUpdateMode = mode === FormModalMode.UPDATE;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prevMode = useRef<FormModalMode>(mode);
  const prevFormId = useRef<string | undefined>(initialForm?.id);

  // Get all existing forms for uniqueness validation
  const allForms = useAppSelector(selectAllForms);

  // Extract initial values from the form once using useMemo to prevent recreation on every render
  const initialValues = useMemo(() => {
    // For create mode or if no initialForm, return default empty values
    if (mode === FormModalMode.CREATE || !initialForm?.id) {
      return { ...DEFAULT_FORM_VALUES };
    }
    // For update mode, extract values from the form
    return extractFormValues(initialForm);
  }, [mode, initialForm?.id]);

  // Form validation function that uses the utility
  const validateFormValues = useCallback(
    (values: FormValues) => {
      return validateForm(values, allForms, isUpdateMode ? initialForm?.id : undefined);
    },
    [allForms, isUpdateMode, initialForm?.id]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      // Clear any previous submit errors
      setSubmitError(null);

      try {
        const formData = prepareFormData(values);

        if (isUpdateMode && initialForm?.id) {
          // Update existing form
          dispatch(
            updateForm({
              id: initialForm.id,
              ...formData,
            })
          );
        } else {
          // Create new form
          dispatch(addForm(formData));
        }

        // Close modal
        onClose();
      } catch (error) {
        console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} form:`, error);
        setSubmitError(
          isUpdateMode ? FORM_SUBMIT_ERRORS.UPDATE_FAILED : FORM_SUBMIT_ERRORS.CREATE_FAILED
        );
        throw error; // Let the form hook handle the error
      }
    },
    [isUpdateMode, initialForm?.id, dispatch, onClose]
  );

  // Initialize form with useForm hook
  const { values, errors, isSubmitting, handleChange, handleSubmit, setValues, resetForm } =
    useForm<FormValues>({
      initialValues,
      onSubmit: handleFormSubmit,
      validate: validateFormValues,
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
  const modalTitle = FORM_MODAL_TEXT[mode].TITLE;
  const submitButtonText = FORM_MODAL_TEXT[mode].SUBMIT_BUTTON;

  // Modal footer with action buttons
  const modalFooter = (
    <>
      <Button variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
        {FORM_MODAL_TEXT.CANCEL_BUTTON}
      </Button>
      <Button type="submit" form="form-modal" isLoading={isSubmitting}>
        {submitButtonText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title={modalTitle} footer={modalFooter}>
      <div className={styles.formContainer}>
        <form id="form-modal" onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <Input
              id="title"
              name="title"
              label={FORM_FIELD_LABELS.FORM_NAME}
              value={values.title}
              onChange={handleChange}
              placeholder={FORM_FIELD_PLACEHOLDERS.FORM_NAME}
              error={errors.title}
              fullWidth
              required
              autoFocus
            />
          </div>

          <div className={styles.checkboxGroup}>
            <Checkbox
              id="isVisible"
              name="isVisible"
              label={FORM_FIELD_LABELS.VISIBLE}
              checked={values.isVisible}
              onChange={handleChange}
            />

            <Checkbox
              id="isReadOnly"
              name="isReadOnly"
              label={FORM_FIELD_LABELS.READ_ONLY}
              checked={values.isReadOnly}
              onChange={handleChange}
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
