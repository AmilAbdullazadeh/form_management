'use client';

import React from 'react';

import { Button } from '@/components/common';
import { FormCard } from '@/components/common/Card/Form/FormCard';
import { BadgeVariant } from '@/components/common/Card/Form/types';
import { parseDescriptionProperty } from '@/utils/form';

import styles from './FormItemCard.module.scss';

export interface FormItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  fields?: number;
  submissions?: number;
}

interface FormItemCardProps {
  form: FormItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

/**
 * FormItemCard component for displaying form items
 */
export const FormItemCard: React.FC<FormItemCardProps> = ({
  form,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { title, description, fields, submissions } = form;
  
  // Determine visibility and readonly statuses using parseDescriptionProperty
  const isFormVisible = parseDescriptionProperty(description || '', 'isVisible');
  const isFormReadOnly = parseDescriptionProperty(description || '', 'isReadOnly');

  // Helper function to get badge data based on type
  const getBadge = (type: 'visible' | 'readonly'): { text: string, variant: BadgeVariant } => {
    if (type === 'visible') {
      return {
        text: isFormVisible ? 'Visible' : 'Hidden',
        variant: isFormVisible ? 'success' : 'danger'
      };
    } else {
      return {
        text: isFormReadOnly ? 'Read Only' : 'Editable',
        variant: isFormReadOnly ? 'warning' : 'success'
      };
    }
  };
  
  // Handle edit
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(form.id);
  };
  
  // Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(form.id);
  };
  
  return (
    <FormCard
      title={title}
      badge={[
        getBadge('visible'),
        getBadge('readonly')
      ]}
      className={`${className} ${!isFormVisible ? styles.disabled : ''} ${isFormReadOnly ? styles.readonly : ''}`}
      metadata={[
        ...(fields !== undefined ? [{ text: `${fields} fields` }] : []),
        ...(submissions !== undefined ? [{ text: `${submissions} submissions` }] : [])
      ]}
      actions={
        <>
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              disabled={!isFormVisible}
            >
              {isFormReadOnly ? 'Show Details' : 'Edit'}
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={!isFormVisible || isFormReadOnly}
            >
              Delete
            </Button>
          )}
        </>
      }
    />
  );
}; 