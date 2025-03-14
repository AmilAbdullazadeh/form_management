'use client';

import React from 'react';

import { Button } from '@/components/common';
import { FormCard } from '@/components/common/Card/Form/FormCard';
import { BadgeVariant } from '@/components/common/Card/Form/types';
import { parseDescriptionProperty } from '@/utils/form';

import styles from './FormItemCard.module.scss';
import { FormItemCardProps } from './types';

export const FormItemCard: React.FC<FormItemCardProps> = ({
  form,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { title, description, fields, submissions } = form;
  
  const isFormVisible = parseDescriptionProperty(description || '', 'isVisible');
  const isFormReadOnly = parseDescriptionProperty(description || '', 'isReadOnly');

  // Get badge data based on type
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
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(form.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(form.id);
  };

  const fieldCountDisplay = fields !== undefined ? {
    icon: <span className={styles.fieldIcon}>📋</span>,
    text: `${fields} ${fields === 1 ? 'field' : 'fields'}`
  } : null;

  const submissionsCountDisplay = submissions !== undefined ? {
    icon: <span className={styles.submissionIcon}>📝</span>,
    text: `${submissions} ${submissions === 1 ? 'submission' : 'submissions'}`
  } : null;

  return (
    <FormCard
      title={title}
      badge={[
        getBadge('visible'),
        getBadge('readonly')
      ]}
      className={`${className} ${!isFormVisible ? styles.disabled : ''} ${isFormReadOnly ? styles.readOnly : ''}`}
      metadata={[
        ...(fieldCountDisplay ? [fieldCountDisplay] : []),
        ...(submissionsCountDisplay ? [submissionsCountDisplay] : [])
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