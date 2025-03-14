import { DEFAULT_FORM_VALUES } from '@/constants/states';
import { FormValues } from '@/types/form';
import { Form } from '@/types/hook';

/**
 * Parse the form description to extract boolean values
 * 
 * @param description - The form description text
 * @param property - The property to extract (isVisible, isReadOnly)
 * @returns Extracted boolean value
 */
export const parseDescriptionProperty = (
  description: string,
  property: 'isVisible' | 'isReadOnly'
): boolean => {
  if (!description) return property === 'isVisible' ? true : false; // Default values
  
  const propertyName = property === 'isVisible' ? 'Visible' : 'ReadOnly';
  return description.includes(`${propertyName}: true`);
};

/**
 * Get initial form values from a form object
 * 
 * @param form - The form object to extract values from
 * @returns FormValues object with extracted values
 */
export const getInitialFormValues = (form?: Partial<Form>): FormValues => {
  // If no form or no ID, return default values
  if (!form?.id) {
    return { ...DEFAULT_FORM_VALUES };
  }
  
  // Extract values from form
  const description = form.description || '';
  
  return {
    title: form.title || '',
    isVisible: parseDescriptionProperty(description, 'isVisible'),
    isReadOnly: parseDescriptionProperty(description, 'isReadOnly'),
  };
};

/**
 * Extract form values from a Form object
 * @param form The form to extract values from
 * @returns The form values extracted from the form
 */
export const extractFormValues = (form?: Partial<Form>): FormValues => {
  if (!form || !form.id) {
    return { ...DEFAULT_FORM_VALUES };
  }

  const description = form.description || '';
  
  // Check if the description follows our format
  const hasFormattedDescription = description.includes('Visible:') || description.includes('ReadOnly:');
  
  if (hasFormattedDescription) {
    return {
      title: form.title || '',
      isVisible: parseDescriptionProperty(description, 'isVisible'),
      isReadOnly: parseDescriptionProperty(description, 'isReadOnly')
    };
  } else {
    return {
      title: form.title || '',
      isVisible: true,
      isReadOnly: false
    };
  }
};

/**
 * Prepare form data for submission
 * @param values Form values to prepare
 * @returns The prepared form data object
 */
export const prepareFormData = (values: FormValues) => {
  return {
    title: values.title,
    description: generateFormDescription(values)
  };
};

/**
 * Generate form description from form values
 * @param values The form values to convert to description
 * @returns Generated description string
 */
export const generateFormDescription = (values: FormValues): string => {
  return `Visible: ${values.isVisible}, ReadOnly: ${values.isReadOnly}`;
}; 