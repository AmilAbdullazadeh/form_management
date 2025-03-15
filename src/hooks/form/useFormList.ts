import { useCallback, useEffect, useState } from 'react';

import { useDeleteFormMutation, useGetFormsQuery } from '@/lib/redux/slices/apiSlice';
import { FormModalMode, FormModalState } from '@/types/form';

/**
 * @returns Form list state and handlers
 */
export const useFormList = () => {
  const { data: forms = [], isLoading: isApiLoading } = useGetFormsQuery();
  const [deleteForm] = useDeleteFormMutation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<FormModalState>({
    isOpen: false,
    mode: FormModalMode.CREATE,
    selectedFormId: null
  });
  
  const selectedForm = forms.find(form => form._id === modalState.selectedFormId);
  
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
    setModalState({
      isOpen: true,
      mode: FormModalMode.UPDATE,
      selectedFormId: id
    });
  }, []);
  
  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteForm(id);
    }
  }, [deleteForm]);
  
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);
  
  // loading state or API status
  const showSkeleton = isLoading || isApiLoading;
  
  return {
    forms,
    selectedForm,
    isLoading: showSkeleton,
    modalState,
    handleOpenCreateModal,
    handleEdit,
    handleDelete,
    handleCloseModal,
  };
}; 