'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import { UseFormProps } from '@/types/hook';

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
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Keep track of initialValues with a ref
  const initialValuesRef = useRef(initialValues);
  
  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);
  
  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsSubmitted(false);
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
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (validate && isSubmitted) {
      const validationErrors = validate({
        ...values,
        [name]: newValue
      });
      setErrors(validationErrors);
    }
  }, [values, validate, isSubmitted]);
  
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    let formIsValid = true;
    let validationErrors = {} as Partial<Record<keyof T, string>>;
    
    if (validate) {
      validationErrors = validate(values);
      formIsValid = Object.keys(validationErrors).length === 0;
      setErrors(validationErrors);
    }
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    
    setTouched(allTouched);
    setIsSubmitted(true);
    
    if (formIsValid) {
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({
          ...errors,
          submit: 'An error occurred while submitting the form'
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    setValues,
    resetForm
  };
}; 