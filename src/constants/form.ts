import { FormModalMode } from '@/types/form';

/**
 * Form validation error messages
 */
export const  FORM_VALIDATION_ERRORS = {
  TITLE_REQUIRED: 'Form name is required',
  TITLE_UNIQUE: 'Form name must be unique',
  TITLE_FORMAT: 'Form name must contain only English letters and numbers',
  TITLE_CAPITALIZATION: 'Form name must start with an uppercase letter',
  SUBMIT_ERROR: (isUpdateMode: boolean) => isUpdateMode ? 'Failed to update form. Please try again.' : 'Failed to create form. Please try again.'
};

// FORM_FIELD_LABELS
export const FORM_FIELD_LABELS = {
  TYPE: 'Field Type',
  LABEL: 'Field Label',
  PLACEHOLDER: 'Placeholder',
  REQUIRED: 'Required',
  OPTIONS: 'Options',
  DEFAULT_VALUE: 'Default Value',
  VISIBLE: 'Visible',
  READ_ONLY: 'Read Only',
  FORM_NAME: 'Form Name',
  FORM_DESCRIPTION: 'Form Description',
  FORM_FIELDS: 'Form Fields',
};

// FORM_FIELD_PLACEHOLDERS
export const FORM_FIELD_PLACEHOLDERS = {
  TEXT: 'Enter text...',
  NUMBER: 'Enter number...',
  EMAIL: 'Enter email...',
  PASSWORD: 'Enter password...',
  FORM_NAME: 'Enter form name...',
  FORM_DESCRIPTION: 'Enter form description...',
};

/**
 * Form modal text constants
 */
export const FORM_MODAL_TEXT = {
  [FormModalMode.CREATE]: {
    TITLE: 'Create Form',
    SUBMIT_BUTTON: 'Create'
  },
  [FormModalMode.UPDATE]: {
    TITLE: 'Update Form',
    SUBMIT_BUTTON: 'Save Changes'
  },
  [FormModalMode.VIEW]: {
    TITLE: 'Form Details',
    SUBMIT_BUTTON: 'Close'
  },
  CANCEL_BUTTON: 'Cancel',
};

/**
 * Form default values
 */
export const FORM_DEFAULT_VALUES = {
  title: '',
  isVisible: true,
  isReadOnly: false
};

/**
 * Form error messages
 */
export const FORM_SUBMIT_ERRORS = {
  CREATE_FAILED: 'Failed to create form. Please try again.',
  UPDATE_FAILED: 'Failed to update form. Please try again.',
};

/**
 * Form empty state messages
 */
export const FORM_EMPTY_STATES = {
  NO_FORMS_FOUND: 'No forms found. Click \'Create Form\' to add one.'
}; 

/**
 * Form-related constants to avoid magic strings throughout the application
 * Using constants improves maintainability and prevents typos
 */

// Form properties
export const FormProperties = {
  IS_VISIBLE: 'isVisible',
  IS_READ_ONLY: 'isReadOnly',
  TITLE: 'title',
} as const;

// Form states
export const FormStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

// Form operations
export const FormOperations = {
  CREATING: 'creating',
  UPDATING: 'updating',
  DELETING: 'deleting',
  VIEWING: 'viewing',
} as const;

// Field types
export const FieldTypes = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  DROPDOWN: 'dropdown',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  DATE: 'date',
  EMAIL: 'email',
} as const; 