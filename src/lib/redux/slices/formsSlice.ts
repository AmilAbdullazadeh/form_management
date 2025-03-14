import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { initialFormsState } from '@/constants/states';
import { Form } from '@/types/hook';

import { RootState } from '../store';

export type FormCreatePayload = Omit<Form, 'id' | 'createdAt'>;
export type FormUpdatePayload = Partial<Form> & { id: string };

export const formsSlice = createSlice({
  name: 'forms',
  initialState: initialFormsState,
  reducers: {
    addForm: (state, action: PayloadAction<FormCreatePayload>) => {
      const newForm = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      state.forms.push(newForm);
    },
    updateForm: (state, action: PayloadAction<FormUpdatePayload>) => {
      const { id, ...updates } = action.payload;
      const index = state.forms.findIndex(form => form.id === id);
      
      if (index !== -1) {
        state.forms[index] = {
          ...state.forms[index],
          ...updates,
        };
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter((form) => form.id !== action.payload);
    },
    setFormsLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setFormsError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setFormsSuccess: (state) => {
      state.status = 'succeeded';
      state.error = null;
    }
  },
});

export const { 
  addForm, 
  updateForm, 
  deleteForm,
  setFormsLoading,
  setFormsError,
  setFormsSuccess
} = formsSlice.actions;

export const selectAllForms = (state: RootState) => state.forms.forms;
export const selectFormsStatus = (state: RootState) => state.forms.status;
export const selectFormsError = (state: RootState) => state.forms.error;

export const selectFormById = createSelector(
  [selectAllForms, (_, formId: string) => formId],
  (forms, formId) => forms.find(form => form.id === formId)
);

export default formsSlice.reducer; 