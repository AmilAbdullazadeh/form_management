'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { FormCardList, SkeletonFormList } from '@/components/common';
import formStyles from '@/components/common/Card/Form/List/FormCardList.module.scss';
import { useFormModal } from '@/components/common/Modal/FormModal/FormModal';
import { FormModal } from '@/components/modals/FormModal/FormModal';
import { FORM_EMPTY_STATES } from '@/constants/form';
import { FORM_BUTTON_TEXT } from '@/constants/form-labels';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteForm, selectAllForms, selectFormById, selectFormsStatus } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, FormModalState } from '@/types/form';
import { parseDescriptionProperty } from '@/utils/form';

/**
 * FormList component - Displays a list of forms using the common FormCardList component
 * All logic is directly included in the component
 */
export const FormList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openDeleteModal } = useFormModal();
  
  // Use selectors to get data from redux store
  const forms = useAppSelector(selectAllForms);
  const formsStatus = useAppSelector(selectFormsStatus);
  
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<FormModalState>({
    isOpen: false,
    mode: FormModalMode.CREATE,
    selectedFormId: null
  });
  
  // Get selected form using the memoized selector
  const selectedForm = useAppSelector(
    state => modalState.selectedFormId 
      ? selectFormById(state, modalState.selectedFormId) 
      : undefined
  );
  
  // Simulate loading state for demonstration
  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle opening create modal
  const handleOpenCreateModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: FormModalMode.CREATE,
      selectedFormId: null
    });
  }, []);
  
  // Handle opening update modal or view details modal
  const handleEdit = useCallback((id: string) => {
    const form = forms.find(f => f.id === id);
    
    // Move the state update to useEffect to avoid setting state during render
    if (form) {
      const isReadOnly = parseDescriptionProperty(form.description || '', 'isReadOnly');
      
      setModalState({
        isOpen: true,
        mode: isReadOnly ? FormModalMode.VIEW : FormModalMode.UPDATE,
        selectedFormId: id
      });
    }
  }, [forms]);
  
  // Handle form deletion - updated to use the modal confirmation
  const handleDelete = useCallback((id: string) => {
    // Find the form to get its title
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
  
  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);
  
  // Determine if we should show skeleton based on loading state or API status
  const showSkeleton = isLoading || formsStatus === 'loading';
  
  // Render loading skeleton or form list
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