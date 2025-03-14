import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteForm, selectAllForms, selectFormById, selectFormsStatus } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, ModalState } from '@/types/form';

/**
 * @returns Form list state and handlers
 */
export const useFormList = () => {
  const dispatch = useAppDispatch();
  
  const forms = useAppSelector(selectAllForms);
  const formsStatus = useAppSelector(selectFormsStatus);
  
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
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
    setModalState({
      isOpen: true,
      mode: FormModalMode.UPDATE,
      selectedFormId: id
    });
  }, []);
  
  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dispatch(deleteForm(id));
    }
  }, [dispatch]);
  
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);
  
  // Determine if we should show skeleton based on loading state or API status
  const showSkeleton = isLoading || formsStatus === 'loading';
  
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