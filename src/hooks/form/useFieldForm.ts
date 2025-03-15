'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import { FORM_FIELD_VALIDATION_ERRORS } from '@/constants/form-labels';

export enum FieldType {
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email'
}

export interface FieldFormValues {
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string;
  defaultValue?: string;
}

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
  formId?: string;
}

export const useFieldForm = ({ onSave, onClose }: UseFieldFormProps) => {
  const [values, setValues] = useState<FieldFormValues>(DEFAULT_FIELD_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FieldFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FieldFormValues, string>> = {};
    
    if (!values.label.trim()) {
      newErrors.label = FORM_FIELD_VALIDATION_ERRORS.LABEL_REQUIRED;
    }
    
    if ((values.type === FieldType.DROPDOWN || values.type === FieldType.RADIO) && !values.options?.trim()) {
      newErrors.options = FORM_FIELD_VALIDATION_ERRORS.OPTIONS_REQUIRED;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const processedValues = { ...values };
      
      await onSave(processedValues);
      
      onClose();
    } catch (error) {
      console.error('Error saving field:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSave, onClose]);

  const resetForm = useCallback(() => {
    setValues(DEFAULT_FIELD_VALUES);
    setErrors({});
  }, []);

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