import { FormModalMode } from '@/types/form';

/**
 * Form validation error messages
 */
export const FORM_VALIDATION_ERRORS = {
  TITLE_REQUIRED: 'Form name is required',
  TITLE_UNIQUE: 'Form name must be unique',
  TITLE_FORMAT: 'Form name must contain only English letters and numbers',
  TITLE_CAPITALIZATION: 'Form name must start with an uppercase letter',
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