'use client';

import React from 'react';

import { Eye } from '@/assets/icons/Eye';
import { Trash } from '@/assets/icons/Trash';
import { Update } from '@/assets/icons/Update';
import { Button } from '@/components/common';
import { FormCard } from '@/components/common/Card/Form/FormCard';
import { BadgeVariant } from '@/components/common/Card/Form/types';

import styles from './FormItemCard.module.scss';
import { FormItemCardProps } from './types';
import { FORM_FIELD_LABELS } from '@/constants/form';


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
        text: isVisible ? FORM_FIELD_LABELS.VISIBLE : FORM_FIELD_LABELS.HIDDEN,
        variant: isVisible ? 'success' : 'danger'
      };
    } else {
      return {
        text: isReadOnly ? FORM_FIELD_LABELS.READ_ONLY : FORM_FIELD_LABELS.EDITABLE,
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
    text: `${fields.length} ${fields.length === 1 ? FORM_FIELD_LABELS.FIELD : FORM_FIELD_LABELS.FIELDS}`
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
              className={styles.button}
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={!isVisible}
              icon={isReadOnly ? <Eye /> : <Update />}
            />
          )}
          
          {onDelete && (
            <Button
              className={styles.button}
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={!isVisible || isReadOnly}
              icon={<Trash />}
            />
          )}
        </>
      }
    />
  );
}; 