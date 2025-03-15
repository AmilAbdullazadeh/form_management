'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import { FormField } from '@/types/api';
import { validateFieldName } from '@/utils/validation';

export interface FieldFormValues {
  name: string;
  type: string;
  isRequired: boolean;
}

export const DEFAULT_FIELD_VALUES: FieldFormValues = {
  name: '',
  type: 'text',
  isRequired: false
};

interface UseFieldFormProps {
  onSave: (field: FormField) => void;
  onClose: () => void;
  existingFields?: FormField[];
}

export const useFieldForm = ({ onSave, onClose, existingFields = [] }: UseFieldFormProps) => {
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
    
    if (errors[name as keyof FieldFormValues]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FieldFormValues, string>> = {};
    
    const nameValidation = validateFieldName(values.name, existingFields);
    if (!nameValidation.isValid && nameValidation.error) {
      newErrors.name = nameValidation.error;
    }
    
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  }, [values, existingFields]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm();
    setErrors(errors);
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const field: FormField = {
        name: values.name,
        type: values.type as FormField['type'],
        isRequired: values.isRequired
      };
      
      onSave(field);
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

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm
  };
}; 