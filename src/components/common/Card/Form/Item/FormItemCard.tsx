'use client';

import React from 'react';

import { Button } from '@/components/common';
import { FormCard } from '@/components/common/Card/Form/FormCard';
import { BadgeVariant } from '@/components/common/Card/Form/types';

import styles from './FormItemCard.module.scss';
import { FormItemCardProps } from './types';

export const FormItemCard: React.FC<FormItemCardProps> = ({
  form,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { name, isVisible, isReadOnly, fields } = form;
  
  // Get badge data based on type
  const getBadge = (type: 'visible' | 'readonly'): { text: string, variant: BadgeVariant } => {
    if (type === 'visible') {
      return {
        text: isVisible ? 'Visible' : 'Hidden',
        variant: isVisible ? 'success' : 'danger'
      };
    } else {
      return {
        text: isReadOnly ? 'Read Only' : 'Editable',
        variant: isReadOnly ? 'warning' : 'success'
      };
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(form._id!);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(form._id!);
  };

  const fieldCountDisplay = fields ? {
    icon: <span className={styles.fieldIcon}>📋</span>,
    text: `${fields.length} ${fields.length === 1 ? 'field' : 'fields'}`
  } : null;

  return (
    <FormCard
      title={name}
      badge={[
        getBadge('visible'),
        getBadge('readonly')
      ]}
      className={`${className} ${!isVisible ? styles.disabled : ''} ${isReadOnly ? styles.readOnly : ''}`}
      metadata={[
        ...(fieldCountDisplay ? [fieldCountDisplay] : [])
      ]}
      actions={
        <>
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              disabled={!isVisible}
            >
              {isReadOnly ? 'Show Details' : 'Edit'}
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={!isVisible || isReadOnly}
            >
              Delete
            </Button>
          )}
        </>
      }
    />
  );
}; 