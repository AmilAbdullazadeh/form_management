'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import { FieldFormValues, FieldType } from '@/types/form';

// Default field values
export const DEFAULT_FIELD_VALUES: FieldFormValues = {
  type: FieldType.TEXT,
  label: '',
  placeholder: '',
  required: false,
  options: '',
  defaultValue: ''
};

interface UseFieldFormProps {
  onSave: (field: FieldFormValues) => Promise<void> | void;
  onClose: () => void;
}

/**
 * Custom hook for managing field form state, validation, and submission
 */
export const useFieldForm = ({ onSave, onClose }: UseFieldFormProps) => {
  // State for field values
  const [values, setValues] = useState<FieldFormValues>(DEFAULT_FIELD_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FieldFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
  const handleSubmit = useCallback(async (e: FormEvent) => {
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

  // Reset form
  const resetForm = useCallback(() => {
    setValues(DEFAULT_FIELD_VALUES);
    setErrors({});
  }, []);

  // Determine if options field should be shown
  const showOptionsField = values.type === FieldType.DROPDOWN || values.type === FieldType.RADIO;

  return {
    values,
    errors,
    isSubmitting,
    showOptionsField,
    handleChange,
    handleSubmit,
    resetForm
  };
}; 