import { FORM_VALIDATION_ERRORS } from '@/constants/form';
import { FORM_FIELD_VALIDATION_ERRORS } from '@/constants/form-labels';
import { Form, FormField } from '@/types/api';

export const isNameEmpty = (name: string): boolean => !name.trim();
export const isNameCapitalized = (name: string): boolean => /^[A-Z]/.test(name);
export const isNameValidFormat = (name: string): boolean => /^[A-Za-z0-9]+$/.test(name);

export const isFieldNameUnique = (name: string, fields: FormField[]): boolean => 
  !fields.some(field => field.name === name);

export const isFormNameUnique = (name: string, forms: Form[], currentFormId?: string): boolean => 
  !forms.some(form => form.name === name && form._id !== currentFormId);

// Validate a field name all rules
export const validateFieldName = (
  name: string,
  existingFields: FormField[] = []
): { isValid: boolean; error?: string } => {
  if (isNameEmpty(name)) {
    return { isValid: false, error: FORM_FIELD_VALIDATION_ERRORS.NAME_REQUIRED };
  }
  
  if (!isNameCapitalized(name)) {
    return { isValid: false, error: FORM_FIELD_VALIDATION_ERRORS.NAME_CAPITALIZATION };
  }
  
  if (!isNameValidFormat(name)) {
    return { isValid: false, error: FORM_FIELD_VALIDATION_ERRORS.NAME_FORMAT };
  }
  
  if (!isFieldNameUnique(name, existingFields)) {
    return { isValid: false, error: FORM_FIELD_VALIDATION_ERRORS.NAME_UNIQUE };
  }
  
  return { isValid: true };
};

// Validate a form name all rules
export const validateFormName = (
  name: string,
  existingForms: Form[] = [],
  currentFormId?: string
): { isValid: boolean; error?: string } => {
  if (isNameEmpty(name)) {
    return { isValid: false, error: FORM_VALIDATION_ERRORS.NAME_REQUIRED };
  }
  
  if (!isNameCapitalized(name)) {
    return { isValid: false, error: FORM_VALIDATION_ERRORS.NAME_CAPITALIZATION };
  }
  
  if (!isNameValidFormat(name)) {
    return { isValid: false, error: FORM_VALIDATION_ERRORS.NAME_FORMAT };
  }
  
  if (!isFormNameUnique(name, existingForms, currentFormId)) {
    return { isValid: false, error: FORM_VALIDATION_ERRORS.NAME_UNIQUE };
  }
  
  return { isValid: true };
}; 