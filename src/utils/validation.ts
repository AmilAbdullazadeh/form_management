import { FORM_VALIDATION_ERRORS } from '@/constants/form';
import { FormValues } from '@/types/form';
import { Form } from '@/types/hook';

// Form validation utilities
export const isFormNameEmpty = (name: string): boolean => !name.trim();
export const isFormNameCapitalized = (name: string): boolean => /^[A-Z]/.test(name);
export const isFormNameValidFormat = (name: string): boolean => /^[A-Za-z0-9]+$/.test(name);
export const isFormNameUnique = (name: string, forms: Form[], currentFormId?: string): boolean => 
  !forms.some(form => form.title === name && !(currentFormId && currentFormId === form.id));

/**
 * Validates a form all rules
*/
export const validateForm = (
  values: FormValues, 
  forms: Form[] = [], 
  currentFormId?: string
): Partial<Record<keyof FormValues, string>> => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  
  if (isFormNameEmpty(values.title)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_REQUIRED;
  } else if (!isFormNameCapitalized(values.title)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_CAPITALIZATION;
  } else if (!isFormNameValidFormat(values.title)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_FORMAT;
  } else if (!isFormNameUnique(values.title, forms, currentFormId)) {
    errors.title = FORM_VALIDATION_ERRORS.TITLE_UNIQUE;
  }
  
  return errors;
}; 