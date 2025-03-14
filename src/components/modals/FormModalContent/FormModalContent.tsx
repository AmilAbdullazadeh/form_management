'use client';

import React from 'react';

import { Checkbox } from '@/components/common/Checkbox';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FieldList } from '@/components/common/FieldList';
import { Input } from '@/components/common/Input';
import { FORM_FIELD_LABELS, FORM_FIELD_PLACEHOLDERS } from '@/constants/form-labels';

import styles from './FormModalContent.module.scss';
import { FormModalContentProps } from './types';

export const FormContent = ({ 
  values, 
  errors, 
  handleChange, 
  isViewOnly, 
  formFields, 
  handleOpenFieldModal,
  handleDeleteField,
  submitError,
  reorderFormFields
}: FormModalContentProps) => {
  const fieldCount = formFields.length;

  return (
    <>
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

      {isViewOnly && (
        <div className={styles.formSummary}>
          <div className={styles.formSummaryItem}>
            <span className={styles.formSummaryLabel}>Fields:</span>
            <span className={styles.formSummaryValue}>{fieldCount}</span>
          </div>
        </div>
      )}
      
      <div className={`${styles.fieldsContainer} ${isViewOnly ? styles.readOnlyFields : ''}`}>
        <FieldList 
          fields={formFields}
          isViewOnly={isViewOnly}
          onAddField={handleOpenFieldModal}
          onDeleteField={handleDeleteField}
          onReorderFields={!isViewOnly ? reorderFormFields : undefined}
          addButtonLabel="Add Field"
          emptyMessage={isViewOnly 
            ? "This form doesn't have any fields yet." 
            : "No fields added yet. Click \"Add Field\" to add form fields."}
        />
      </div>
      
      {submitError && (
        <div className={styles.submitError}>
          <ErrorMessage message={submitError} />
        </div>
      )}
    </>
  );
}; 