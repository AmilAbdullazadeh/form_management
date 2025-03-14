import { v4 as uuidv4 } from 'uuid';

import { FieldsState, FormsState } from "@/types/hook";
import { FormValues } from '@/types/form';

export const initialFieldsState: FieldsState = {
    fields: [],
    status: 'idle',
    error: null
  };
  
  export const initialFormsState: FormsState = {
    forms: [
      {
        id: uuidv4(),
        title: 'UserRegistration',
        description: 'Form for new user registration',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'ContactForm',
        description: 'Contact us form for inquiries',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'FeedbackSurvey',
        description: 'Customer feedback survey form',
        createdAt: new Date().toISOString(),
      },
    ],
    status: 'idle',
    error: null
  };
  
  /**
 * Default form values
 */
export const DEFAULT_FORM_VALUES: FormValues = {
    title: '',
    isVisible: true,
    isReadOnly: false
  };