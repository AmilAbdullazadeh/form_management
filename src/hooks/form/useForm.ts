'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

/**
 * @param initialValues - Initial values for the form
 * @param onSubmit - Function to call when the form is submitted
 * @param validate - Optional function to validate form values
 */
export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Keep track of initialValues with a ref
  const initialValuesRef = useRef(initialValues);
  
  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);
  
  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setIsSubmitting(false);
  }, []);
  
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
      
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: newValue
      });
      setErrors(validationErrors);
    }
  }, [values, validate]);
  
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    let formIsValid = true;
    let validationErrors = {} as Partial<Record<keyof T, string>>;
    
    if (validate) {
      validationErrors = validate(values);
      formIsValid = Object.keys(validationErrors).length === 0;
      setErrors(validationErrors);
    }
    
    if (formIsValid) {
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    resetForm
  };
}; 