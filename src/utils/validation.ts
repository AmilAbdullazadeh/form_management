import { FORM_VALIDATION_ERRORS } from '@/constants/form';
import { Form } from '@/lib/redux/slices/formsSlice';
import { FormValues } from '@/types/form';

/**
 * Form validation-related utility functions
 */

/**
 * Checks if a form name is empty
 * @param name The form name to check
 * @returns True if the name is empty, false otherwise
 */
export const isFormNameEmpty = (name: string): boolean => {
  return !name.trim();
};

/**
 * Checks if a form name starts with an uppercase letter
 * @param name The form name to check
 * @returns True if the name starts with an uppercase letter, false otherwise
 */
export const isFormNameCapitalized = (name: string): boolean => {
  return /^[A-Z]/.test(name);
};

/**
 * Checks if a form name contains only English alphabetic characters and numbers
 * @param name The form name to check
 * @returns True if the name contains only English alphabetic characters and numbers, false otherwise
 */
export const isFormNameValidFormat = (name: string): boolean => {
  return /^[A-Za-z0-9]+$/.test(name);
};

/**
 * Checks if a form name is unique among existing forms
 * @param name The form name to check
 * @param forms Array of existing forms
 * @param currentFormId The ID of the current form (for update mode)
 * @returns True if the name is unique, false otherwise
 */
export const isFormNameUnique = (name: string, forms: Form[], currentFormId?: string): boolean => {
  return !forms.some(form => 
    form.title === name && 
    // Skip checking against the current form in update mode
    !(currentFormId && currentFormId === form.id)
  );
};

/**
 * Validates a form by checking all validation rules
 * @param values The form values to validate
 * @param forms Array of existing forms
 * @param currentFormId The ID of the current form (for update mode)
 * @returns An object containing validation errors, if any
 */
export const validateForm = (
  values: FormValues, 
  forms: Form[], 
  currentFormId?: string
): Partial<Record<keyof FormValues, string>> => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  
  // Check if title is empty
  if (isFormNameEmpty(values.title)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_REQUIRED;
    return errors;
  }
  
  // Check if title starts with an uppercase letter
  if (!isFormNameCapitalized(values.title)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_CAPITALIZATION;
    return errors;
  }
  
  // Check if title contains only English alphabetic characters and numbers
  if (!isFormNameValidFormat(values.title)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_FORMAT;
    return errors;
  }
  
  // Check for uniqueness
  if (!isFormNameUnique(values.title, forms, currentFormId)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_UNIQUE;
  }
  
  return errors;
}; 