'use client';

import React from 'react';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { FieldModal } from '@/components/modals/FieldModal/FieldModal';
import { FORM_MODAL_TEXT } from '@/constants/form';
import { FormModalMode } from '@/types/form';

import { FormContent } from './FormModalContent';
import styles from './FormModalContent.module.scss';
import { FormModalRenderProps } from './types';

export const FormModalRenderer: React.FC<FormModalRenderProps> = ({
  isOpen,
  onClose,
  mode,
  isViewOnly,
  isSubmitting,
  values,
  errors,
  formFields,
  handleChange,
  handleSubmit,
  handleOpenFieldModal,
  handleDeleteField,
  submitError,
  isFieldModalOpen,
  handleCloseFieldModal,
  handleSaveField,
  formId,
  reorderFormFields
}) => {
  // Modal title and submit button text based on mode
  const modalTitle = isViewOnly ? FORM_MODAL_TEXT[FormModalMode.VIEW].TITLE : FORM_MODAL_TEXT[mode].TITLE;
  const submitButtonText = FORM_MODAL_TEXT[mode].SUBMIT_BUTTON;
  
  // Modal footer with action buttons - hide submit button in view-only mode
  const modalFooter = (
    <>
      <Button 
        variant="outline" 
        onClick={onClose} 
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
      onClose={onClose}
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
            handleOpenFieldModal={handleOpenFieldModal}
            handleDeleteField={handleDeleteField}
            submitError={submitError}
            reorderFormFields={reorderFormFields}
          />
        </form>
      </div>
      
      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={handleCloseFieldModal}
        onSave={handleSaveField}
        formId={formId}
      />
    </Modal>
  );
}; 