'use client';

import React from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Input } from '@/components/common/Input';
import { FORM_FIELD_LABELS, FORM_FIELD_PLACEHOLDERS } from '@/constants/form-labels';

import styles from './FormModalContent.module.scss';
import { FormModalContentProps } from './types';

/**
 * Form Fields List component to display fields in the form
 */
export const FormFieldsList = ({ fields, isViewOnly, onAddField }: { 
  fields: any[]; 
  isViewOnly: boolean;
  onAddField: () => void;
}) => {
  return (
    <div className={styles.fieldsSection}>
      <div className={styles.fieldsSectionHeader}>
        <h3>Form Fields</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddField}
          disabled={isViewOnly}
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

/**
 * Form content component to reduce main component size
 */
export const FormContent = ({ 
  values, 
  errors, 
  handleChange, 
  isViewOnly, 
  formFields, 
  isUpdateMode, 
  initialForm, 
  handleOpenFieldModal,
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
      
      {isUpdateMode && initialForm?.id && (
        <FormFieldsList 
          fields={formFields}
          isViewOnly={isViewOnly}
          onAddField={handleOpenFieldModal}
        />
      )}
      
      {submitError && (
        <div className={styles.submitError}>
          <ErrorMessage message={submitError} />
        </div>
      )}
    </>
  );
}; 