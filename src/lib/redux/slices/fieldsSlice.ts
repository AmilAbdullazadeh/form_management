import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { initialFieldsState } from '@/constants/states';
import { FormField } from '@/types/form';

import { RootState } from '../store';

export type FieldCreatePayload = Omit<FormField, 'id'>;
export type FieldUpdatePayload = Partial<FormField> & { id: string };
export type FieldsReorderPayload = {
  formId: string;
  fieldIds: string[];
};

export const fieldsSlice = createSlice({
  name: 'fields',
  initialState: initialFieldsState,
  reducers: {
    addField: (state, action: PayloadAction<FieldCreatePayload>) => {
      const newField = {
        ...action.payload,
        id: uuidv4(),
      };
      state.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<FieldUpdatePayload>) => {
      const { id, ...updates } = action.payload;
      const index = state.fields.findIndex(field => field.id === id);
      
      if (index !== -1) {
        state.fields[index] = {
          ...state.fields[index],
          ...updates,
        };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter((field) => field.id !== action.payload);
    },
    deleteFormFields: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter((field) => field.formId !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<FieldsReorderPayload>) => {
      const { formId, fieldIds } = action.payload;
      
      const formFields = state.fields.filter(field => field.formId === formId);
      
      const fieldMap = new Map(formFields.map(field => [field.id, field]));
      
      const orderedFields = fieldIds
        .filter(id => fieldMap.has(id))
        .map(id => fieldMap.get(id)!);
      
      state.fields = [
        ...state.fields.filter(field => field.formId !== formId),
        ...orderedFields
      ];
    },
    setFieldsLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setFieldsError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setFieldsSuccess: (state) => {
      state.status = 'succeeded';
      state.error = null;
    }
  },
});

export const { 
  addField, 
  updateField, 
  deleteField,
  deleteFormFields,
  reorderFields,
  setFieldsLoading,
  setFieldsError,
  setFieldsSuccess
} = fieldsSlice.actions;

export const selectAllFields = (state: RootState) => state.fields.fields;
export const selectFieldsStatus = (state: RootState) => state.fields.status;
export const selectFieldsError = (state: RootState) => state.fields.error;

export const selectFieldsByFormId = createSelector(
  [selectAllFields, (_, formId: string) => formId],
  (fields, formId) => fields.filter(field => field.formId === formId)
);

export const selectFieldById = createSelector(
  [selectAllFields, (_, fieldId: string) => fieldId],
  (fields, fieldId) => fields.find(field => field.id === fieldId)
);

export default fieldsSlice.reducer; 