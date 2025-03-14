'use client';

import React, { ReactNode } from 'react';

import { Button } from '@/components/common';

import { useModal } from '../ModalContent/ModalContext';

import { FormModalProps } from './types';

/**
 * Gneric form modal
 */
export const useFormModal = () => {
  const { openModal, closeModal } = useModal();

  // Generic form modal
  const openFormModal = ({
    title,
    formContent,
    onSubmit,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    size = 'md',
    isSubmitting = false,
  }: FormModalProps) => {
    openModal({
      title,
      content: formContent,
      size,
      footer: (
        <>
          <Button 
            variant="secondary" 
            onClick={closeModal} 
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={async () => {
              try {
                await onSubmit();
                closeModal();
              } catch (error) {
                console.error('Form submission error:', error);
              }
            }} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : submitLabel}
          </Button>
        </>
      ),
    });
  };

  // Create modal
  const openCreateModal = ({
    title = 'Create New Item',
    formContent,
    onSubmit,
    submitLabel = 'Create',
    ...rest
  }: Partial<FormModalProps> & { formContent: ReactNode; onSubmit: () => Promise<void> }) => {
    openFormModal({
      title,
      formContent,
      onSubmit,
      submitLabel,
      ...rest,
    });
  };

  // Edit modal
  const openEditModal = ({
    title = 'Edit Item',
    formContent,
    onSubmit,
    submitLabel = 'Save Changes',
    ...rest
  }: Partial<FormModalProps> & { formContent: ReactNode; onSubmit: () => Promise<void> }) => {
    openFormModal({
      title,
      formContent,
      onSubmit,
      submitLabel,
      ...rest,
    });
  };

  // Delete confirmation modal
  const openDeleteModal = ({
    title = 'Confirm Delete',
    itemName,
    onDelete,
    isDeleting = false,
  }: {
    title?: string;
    itemName: string;
    onDelete: () => Promise<void>;
    isDeleting?: boolean;
  }) => {
    openModal({
      title,
      content: (
        <p>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
      ),
      size: 'sm',
      footer: (
        <>
          <Button 
            variant="secondary" 
            onClick={closeModal} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={async () => {
              try {
                await onDelete();
                closeModal();
              } catch (error) {
                console.error('Delete error:', error);
              }
            }} 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      ),
    });
  };

  return {
    openFormModal,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModal,
  };
}; 