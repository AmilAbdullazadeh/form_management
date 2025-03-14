'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';

// Define simplified types to avoid linter errors
type FormSubmitFn<T> = (arg0: T) => Promise<void> | void;
type FormValidateFn<T> = (arg0: T) => Partial<Record<keyof T, string>>;

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (formData: T) => Promise<void> | void;
  validate?: (formData: T) => Partial<Record<keyof T, string>>;
}

/**
 * Custom hook for managing form state, validation, and submission
 * @param initialValues - Initial values for the form
 * @param onSubmit - Function to call when the form is submitted
 * @param validate - Optional function to validate form values
 */
export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Keep track of initialValues with a ref
  const initialValuesRef = useRef(initialValues);

  // Update the ref when initialValues change
  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  /**
   * Update form values when initialValues change
   */
  const resetForm = useCallback(() => {
    // Use the ref instead of initialValues directly
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, []); // Now has stable empty dependency array

  /**
   * Handle form input change
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target as HTMLInputElement;

      // Handle different input types
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues(prev => ({
        ...prev,
        [name]: newValue,
      }));

      // Mark field as touched
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));

      // Validate the field if needed
      if (validate && isSubmitted) {
        const validationErrors = validate({
          ...values,
          [name]: newValue,
        });
        setErrors(validationErrors);
      }
    },
    [values, validate, isSubmitted]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate form
      let formIsValid = true;
      let validationErrors = {} as Partial<Record<keyof T, string>>;

      if (validate) {
        validationErrors = validate(values);
        formIsValid = Object.keys(validationErrors).length === 0;
        setErrors(validationErrors);
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Partial<Record<keyof T, boolean>>
      );

      setTouched(allTouched);
      setIsSubmitted(true);

      // Submit form if valid
      if (formIsValid) {
        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } catch (error) {
          // Handle error, it will be caught by the component that uses this hook
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    setValues,
    resetForm,
  };
};
