'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { FormCardList, SkeletonFormList } from '@/components/common';
import formStyles from '@/components/common/Card/Form/List/FormCardList.module.scss';
import { useFormModal } from '@/components/common/Modal/FormModal/FormModal';
import { FormModal } from '@/components/modals/FormModal/FormModal';
import { FORM_EMPTY_STATES, FormStates } from '@/constants/form';
import { FORM_BUTTON_TEXT } from '@/constants/form-labels';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteForm, selectAllForms, selectFormById, selectFormsStatus } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, FormModalState } from '@/types/form';
import { parseDescriptionProperty } from '@/utils/form';

export const FormList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openDeleteModal } = useFormModal();
  
  const forms = useAppSelector(selectAllForms);
  const formsStatus = useAppSelector(selectFormsStatus);
  
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<FormModalState>({
    isOpen: false,
    mode: FormModalMode.CREATE,
    selectedFormId: null
  });
  
  const selectedForm = useAppSelector(
    state => modalState.selectedFormId 
      ? selectFormById(state, modalState.selectedFormId) 
      : undefined
  );
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleOpenCreateModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: FormModalMode.CREATE,
      selectedFormId: null
    });
  }, []);
  
  const handleEdit = useCallback((id: string) => {
    const form = forms.find(f => f.id === id);
    
    if (form) {
      const isReadOnly = parseDescriptionProperty(form.description || '', 'isReadOnly');
      
      setModalState({
        isOpen: true,
        mode: isReadOnly ? FormModalMode.VIEW : FormModalMode.UPDATE,
        selectedFormId: id
      });
    }
  }, [forms]);
  
  const handleDelete = useCallback((id: string) => {
    const formToDelete = forms.find(form => form.id === id);
    
    if (formToDelete) {
      openDeleteModal({
        title: 'Delete Form',
        itemName: formToDelete.title,
        onDelete: async () => {
          dispatch(deleteForm(id));
        }
      });
    }
  }, [dispatch, forms, openDeleteModal]);
  
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);
  
  const showSkeleton = isLoading || formsStatus === FormStates.LOADING;
  
  const renderContent = () => {
    if (showSkeleton) {
      return (
        <SkeletonFormList 
          count={forms.length || 3} 
          gridClassName={formStyles.formCardList} 
        />
      );
    }
    
    return (
      <FormCardList 
        forms={forms}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage={FORM_EMPTY_STATES.NO_FORMS_FOUND}
      />
    );
  };
  
  return (
    <div>
      <div className="header">
        <h1>Form List</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenCreateModal}
        >
          {FORM_BUTTON_TEXT.CREATE_FORM}
        </button>
      </div>
      
      {renderContent()}
      
      <FormModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        initialForm={selectedForm}
      />
    </div>
  );
}; 