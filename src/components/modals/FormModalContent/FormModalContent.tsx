'use client';

import React from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FieldList } from '@/components/common/FieldList';
import { Input } from '@/components/common/Input';
import { FORM_FIELD_LABELS, FORM_FIELD_PLACEHOLDERS } from '@/constants/form-labels';

import styles from './FormModalContent.module.scss';
import { FormModalContentProps } from './types';

export const FormFieldsList = ({ 
  fields, 
  isViewOnly, 
  onAddField,
  onDeleteField 
}: { 
  fields: any[]; 
  isViewOnly: boolean;
  onAddField: () => void;
  onDeleteField?: (fieldId: string) => void;
}) => {
  // Prevent form submission when clicking the Add Field button
  const handleAddFieldClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Handle delete field button click
  const handleDeleteField = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    if (onDeleteField) {
      onDeleteField(fieldId);
    }
  };

  return (
    <div className={styles.fieldsSection}>
      <div className={styles.fieldsSectionHeader}>
        <h3>Form Fields</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddFieldClick}
          disabled={isViewOnly}
          type="button"
        >
          Add Field
        </Button>
      </div>
      
      {fields.length > 0 ? (
        <div className={styles.fieldsList}>
          {fields.map(field => (
            <div key={field.id} className={styles.fieldItem}>
              <div className={styles.fieldInfo}>
                <span className={styles.fieldLabel}>{field.label}</span>
                <span className={styles.fieldType}>{field.type}</span>
                {field.required && <span className={styles.fieldRequired}>Required</span>}
              </div>
              {!isViewOnly && onDeleteField && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => handleDeleteField(e, field.id)}
                  type="button"
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noFields}>
          No fields added yet. Click &quot;Add Field&quot; to add form fields.
        </div>
      )}
    </div>
  );
};

export const FormContent = ({ 
  values, 
  errors, 
  handleChange, 
  isViewOnly, 
  formFields, 
  handleOpenFieldModal,
  handleDeleteField,
  submitError
}: FormModalContentProps) => {
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
      
      <FieldList 
        fields={formFields}
        isViewOnly={isViewOnly}
        onAddField={handleOpenFieldModal}
        onDeleteField={handleDeleteField}
      />
      
      {submitError && (
        <div className={styles.submitError}>
          <ErrorMessage message={submitError} />
        </div>
      )}
    </>
  );
}; 