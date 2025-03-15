import React from 'react';

import { Warning } from '@/assets/icons/Warning';

import styles from './ErrorMessage.module.scss';
import { ErrorMessageProps } from './types';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className={styles.errorContainer} role="alert">
      <Warning />
      <span className={styles.errorText}>{message}</span>
    </div>
  );
}; 