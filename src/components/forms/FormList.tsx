'use client';

import React, { useCallback, useState } from 'react';

import { Button, FormCardList, SkeletonFormList } from '@/components/common';
import formStyles from '@/components/common/Card/Form/List/FormCardList.module.scss';
import { useFormModal } from '@/components/common/Modal/FormModal/FormModal';
import { FormModal } from '@/components/modals/FormModal/FormModal';
import { FORM_EMPTY_STATES } from '@/constants/form';
import { FORM_BUTTON_TEXT } from '@/constants/form-labels';
import { useDeleteFormMutation, useGetFormsQuery } from '@/lib/redux/slices/apiSlice';
import { FormModalMode, FormModalState } from '@/types/form';
import { Plus } from '@/assets/icons/Plus';

export const FormList: React.FC = () => {
  const { openDeleteModal } = useFormModal();
  
  const { data: forms = [], isLoading, error } = useGetFormsQuery();
  const [deleteForm] = useDeleteFormMutation();
  
  const [modalState, setModalState] = useState<FormModalState>({
    isOpen: false,
    mode: FormModalMode.CREATE,
    selectedFormId: null
  });
  
  const selectedForm = forms.find(form => form._id === modalState.selectedFormId);
  
  const handleOpenCreateModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: FormModalMode.CREATE,
      selectedFormId: null
    });
  }, []);
  
  const handleEdit = useCallback((id: string) => {
    const form = forms.find(f => f._id === id);
    
    if (form) {
      setModalState({
        isOpen: true,
        mode: form.isReadOnly ? FormModalMode.VIEW : FormModalMode.UPDATE,
        selectedFormId: id
      });
    }
  }, [forms]);
  
  const handleDelete = useCallback((id: string) => {
    const formToDelete = forms.find(form => form._id === id);
    
    if (formToDelete) {
      openDeleteModal({
        title: 'Delete Form',
        itemName: formToDelete.name,
        onDelete: async () => {
          await deleteForm(id).unwrap();
        }
      });
    }
  }, [forms, openDeleteModal, deleteForm]);
  
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <SkeletonFormList 
          count={forms.length || 3} 
          gridClassName={formStyles.formCardList} 
        />
      );
    }
    
    if (error) {
      return <div>Error loading forms. Please try again.</div>;
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
        <Button
          onClick={handleOpenCreateModal}
          icon={<Plus />}
        >
          {FORM_BUTTON_TEXT.CREATE_FORM}
        </Button>
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