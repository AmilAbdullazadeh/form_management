export interface FormField {
    name: string;
    type: 'text' | 'number' | 'email' | 'date' | 'checkbox' | 'select';
    isRequired: boolean;
  }
  
  export interface Form {
    _id?: string;
    name: string;
    isVisible: boolean;
    isReadOnly: boolean;
    fields: FormField[];
    createdAt?: string;
    updatedAt?: string;
  }