import React from 'react';

import { FormItemCard } from '../Item/FormItemCard';

import styles from './FormCardList.module.scss';
import { FormCardListProps } from './types';

export const FormCardList: React.FC<FormCardListProps> = ({
  forms,
  onEdit,
  onDelete,
  emptyMessage = 'No forms found',
  className = '',
}) => {
  if (forms.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className}`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.formCardList} ${className}`}>
      {forms.map(form => (
        <FormItemCard key={form.id} form={form} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
