import { FormModalMode } from '@/types/form';

export const  FORM_VALIDATION_ERRORS = {
  NAME_REQUIRED: 'Form name is required',
  NAME_UNIQUE: 'Form name must be unique',
  NAME_FORMAT: 'Form name must contain only English letters and numbers',
  NAME_CAPITALIZATION: 'Form name must start with an uppercase letter',
  SUBMIT_ERROR: (isUpdateMode: boolean) => isUpdateMode ? 'Failed to update form. Please try again.' : 'Failed to create form. Please try again.'
};

export const FORM_FIELD_LABELS = {
  TYPE: 'Field Type',
  LABEL: 'Field Label',
  PLACEHOLDER: 'Placeholder',
  REQUIRED: 'Required',
  OPTIONS: 'Options',
  DEFAULT_VALUE: 'Default Value',
  VISIBLE: 'Visible',
  HIDDEN: 'Hidden',
  EDITABLE: 'Editable',
  READ_ONLY: 'Read Only',
  FORM_NAME: 'Form Name',
  FORM_DESCRIPTION: 'Form Description',
  FORM_FIELDS: 'Form Fields',
  FIELD: 'Field',
  FIELDS: 'Fields',
  ADD_FIELD: 'Add Field',
};

export const FORM_FIELD_PLACEHOLDERS = {
  TEXT: 'Enter text...',
  NUMBER: 'Enter number...',
  EMAIL: 'Enter email...',
  PASSWORD: 'Enter password...',
  FORM_NAME: 'Enter form name...',
  FORM_DESCRIPTION: 'Enter form description...',
};

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

export const FORM_DEFAULT_VALUES = {
  name: '',
  isVisible: true,
  isReadOnly: false
};

export const FORM_SUBMIT_ERRORS = {
  CREATE_FAILED: 'Failed to create form. Please try again.',
  UPDATE_FAILED: 'Failed to update form. Please try again.',
};

export const FORM_EMPTY_STATES = {
  NO_FORMS_FOUND: 'No forms found. Click "Create Form" to add one.',
  NO_FIELDS_FOUND: 'This form doesn\'t have any fields yet.',
  NO_FIELDS_ADDED: 'No fields added yet. Click "Add Field" to add form fields.'
}; 

export const FormProperties = {
  NAME: 'name',
  IS_VISIBLE: 'isVisible',
  IS_READ_ONLY: 'isReadOnly'
};

export const FormStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
};

export const FormOperations = {
  CREATING: 'creating',
  UPDATING: 'updating',
  DELETING: 'deleting',
  VIEWING: 'viewing'
};

export const FieldTypes = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  DROPDOWN: 'dropdown',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  DATE: 'date',
  EMAIL: 'email'
}; 

export const STATUS_VARIANTS = {
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger'
};