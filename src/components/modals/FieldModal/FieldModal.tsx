'use client';

import React, { useCallback } from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Select } from '@/components/common/Select';
import { useFieldForm, FieldFormValues } from '@/hooks/form/useFieldForm';

import styles from './FieldModal.module.scss';

// Field type options for the dropdown
const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text Input' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' }
];

export interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId?: string;
  onSave: (field: FieldFormValues) => void;
}

export const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { 
    values, 
    errors, 
    isSubmitting, 
    showOptionsField,
    handleChange, 
    handleSubmit,
    resetForm
  } = useFieldForm({
    onSave,
    onClose
  });
  
  // Reset form when modal closes
  const handleCloseModal = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Add Field"
      size="md"
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit"
            form="field-form"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Add Field
          </Button>
        </>
      }
    >
      <form id="field-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <Input
            id="label"
            name="label"
            label="Field Label"
            placeholder="Enter a label for this field"
            value={values.label}
            onChange={handleChange}
            error={errors.label}
            required
            autoFocus
          />
        </div>
        
        <div className={styles.formGroup}>
          <Select
            id="type"
            name="type"
            label="Field Type"
            value={values.type}
            onChange={handleChange}
            options={FIELD_TYPE_OPTIONS}
            error={errors.type}
            required
          />
        </div>
        
        {showOptionsField && (
          <div className={styles.formGroup}>
            <Input
              id="options"
              name="options"
              label="Options"
              placeholder="Enter options separated by commas (e.g., 'Option 1, Option 2, Option 3')"
              value={values.options}
              onChange={handleChange}
              error={errors.options}
              required
            />
          </div>
        )}
        
        <div className={styles.formGroup}>
          <Input
            id="placeholder"
            name="placeholder"
            label="Placeholder Text"
            placeholder="Enter placeholder text"
            value={values.placeholder}
            onChange={handleChange}
            error={errors.placeholder}
          />
        </div>
        
        <div className={styles.formGroup}>
          <Checkbox
            id="required"
            name="required"
            label="Required Field"
            checked={values.required}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
}; 