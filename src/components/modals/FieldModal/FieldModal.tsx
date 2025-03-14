'use client';

import React, { useCallback, useState } from 'react';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Select } from '@/components/common/Select';
import { FieldFormValues, FieldModalProps, FieldType } from '@/types/form';

import styles from './FieldModal.module.scss';

// Default field values
const DEFAULT_FIELD_VALUES: FieldFormValues = {
  type: FieldType.TEXT,
  label: '',
  placeholder: '',
  required: false,
  options: '',
  defaultValue: ''
};

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
  formId,
  onSave
}) => {
  // State for field values
  const [values, setValues] = useState<FieldFormValues>(DEFAULT_FIELD_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FieldFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValues(prev => ({ ...prev, [name]: checked }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name as keyof FieldFormValues]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FieldFormValues, string>> = {};
    
    if (!values.label.trim()) {
      newErrors.label = 'Field label is required';
    }
    
    // For dropdown and radio, options are required
    if ((values.type === FieldType.DROPDOWN || values.type === FieldType.RADIO) && !values.options?.trim()) {
      newErrors.options = 'Options are required for dropdown and radio fields';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process options string into array if needed
      const processedValues = { ...values };
      
      // Call the onSave callback
      await onSave(processedValues);
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error saving field:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSave, onClose]);

  // Reset form when modal closes
  const handleModalClose = useCallback(() => {
    setValues(DEFAULT_FIELD_VALUES);
    setErrors({});
    onClose();
  }, [onClose]);

  // Determine if options field should be shown
  const showOptionsField = values.type === FieldType.DROPDOWN || values.type === FieldType.RADIO;

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