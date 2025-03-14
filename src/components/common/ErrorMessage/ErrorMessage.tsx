import React from 'react';

import styles from './ErrorMessage.module.scss';
import { ErrorMessageProps } from './types';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className={styles.errorContainer} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">
        ⚠️
      </span>
      <span className={styles.errorText}>{message}</span>
    </div>
  );
}; 