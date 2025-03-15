'use client';

import React, { useCallback } from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Select } from '@/components/common/Select';
import { useFieldForm } from '@/hooks/form/useFieldForm';
import { FormField } from '@/types/api';

import styles from './FieldModal.module.scss';

const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'select', label: 'Select' }
];

export interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  existingFields?: FormField[];
}

export const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingFields = []
}) => {
  const { 
    values, 
    errors, 
    isSubmitting,
    handleChange, 
    handleSubmit,
    resetForm
  } = useFieldForm({
    onSave,
    onClose,
    existingFields
  });
  
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
            id="name"
            name="name"
            label="Field Name"
            placeholder="Enter a name for this field"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
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
        
        <div className={styles.formGroup}>
          <Checkbox
            id="isRequired"
            name="isRequired"
            label="Required Field"
            checked={values.isRequired}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
}; 