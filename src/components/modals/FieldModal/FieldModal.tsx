'use client';

import React, { useCallback } from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Select } from '@/components/common/Select';
import { useFieldForm } from '@/hooks/form/useFieldForm';
import { FieldModalProps, FieldType } from '@/types/form';

import styles from './FieldModal.module.scss';

// Field type options for the dropdown
const FIELD_TYPE_OPTIONS = [
  { value: FieldType.TEXT, label: 'Text Input' },
  { value: FieldType.CHECKBOX, label: 'Checkbox' },
  { value: FieldType.DROPDOWN, label: 'Dropdown' },
  { value: FieldType.RADIO, label: 'Radio Buttons' },
  { value: FieldType.TEXTAREA, label: 'Text Area' },
  { value: FieldType.NUMBER, label: 'Number' },
  { value: FieldType.DATE, label: 'Date' },
  { value: FieldType.EMAIL, label: 'Email' }
];

/**
 * Field Modal component for adding or editing form fields
 */
export const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formId
}) => {
  // Use the field form hook
  const {
    values,
    errors,
    isSubmitting,
    showOptionsField,
    handleChange,
    handleSubmit,
    resetForm
  } = useFieldForm({ onSave, onClose, formId });

  // Reset form when modal closes
  const handleModalClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  // Modal footer with action buttons
  const modalFooter = (
    <>
      <Button 
        variant="outline" 
        onClick={handleModalClose} 
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        form="field-modal-form"
        isLoading={isSubmitting}
      >
        Add Field
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Add Field"
      footer={modalFooter}
    >
      <div className={styles.formContainer}>
        <form id="field-modal-form" onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <Select
              id="type"
              name="type"
              label="Field Type"
              value={values.type}
              onChange={handleChange}
              options={FIELD_TYPE_OPTIONS}
              error={errors.type}
              fullWidth
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <Input
              id="label"
              name="label"
              label="Field Label"
              value={values.label}
              onChange={handleChange}
              placeholder="Enter field label"
              error={errors.label}
              fullWidth
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <Input
              id="placeholder"
              name="placeholder"
              label="Placeholder Text"
              value={values.placeholder || ''}
              onChange={handleChange}
              placeholder="Enter placeholder text"
              error={errors.placeholder}
              fullWidth
            />
          </div>
          
          {showOptionsField && (
            <div className={styles.formGroup}>
              <Input
                id="options"
                name="options"
                label="Options (comma-separated)"
                value={values.options || ''}
                onChange={handleChange}
                placeholder="Option 1, Option 2, Option 3"
                error={errors.options}
                fullWidth
                required
              />
            </div>
          )}
          
          <div className={styles.formGroup}>
            <Input
              id="defaultValue"
              name="defaultValue"
              label="Default Value"
              value={values.defaultValue || ''}
              onChange={handleChange}
              placeholder="Enter default value"
              error={errors.defaultValue}
              fullWidth
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="required"
              name="required"
              label="Required Field"
              checked={values.required}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}; 