import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteForm, selectAllForms, selectFormById, selectFormsStatus } from '@/lib/redux/slices/formsSlice';
import { FormModalMode, ModalState } from '@/types/form';

/**
 * Custom hook for form list functionality
 * 
 * @returns Form list state and handlers
 */
export const useFormList = () => {
  const dispatch = useAppDispatch();
  
  // Use selectors to get data from redux store
  const forms = useAppSelector(selectAllForms);
  const formsStatus = useAppSelector(selectFormsStatus);
  
  // Use object state for related state values
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
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
  
  // Handle opening update modal
  const handleEdit = useCallback((id: string) => {
    setModalState({
      isOpen: true,
      mode: FormModalMode.UPDATE,
      selectedFormId: id
    });
  }, []);
  
  // Handle form deletion
  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dispatch(deleteForm(id));
    }
  }, [dispatch]);
  
  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);
  
  // Determine if we should show skeleton based on loading state or API status
  const showSkeleton = isLoading || formsStatus === 'loading';
  
  return {
    // Data
    forms,
    selectedForm,
    
    // State
    isLoading: showSkeleton,
    modalState,
    
    // Handlers
    handleOpenCreateModal,
    handleEdit,
    handleDelete,
    handleCloseModal,
  };
}; 