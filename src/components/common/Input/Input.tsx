import React, { InputHTMLAttributes, forwardRef } from 'react';

import { ErrorMessage } from '@/components/common/ErrorMessage';

import styles from './Input.module.scss';
import { InputConfig } from './types';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & InputConfig;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    fullWidth = false, 
    className = '', 
    containerClassName = '',
    ...props 
  }, ref) => {
    // Generate input classes based on props
    const getInputClasses = () => {
      const classes = [styles.input];
      
      if (error) {
        classes.push(styles.error);
      }
      
      if (fullWidth) {
        classes.push(styles.full);
      }
      
      if (className) {
        classes.push(className);
      }
      
      return classes.join(' ');
    };
    
    // Generate container classes based on props
    const getContainerClasses = () => {
      const classes = [styles.formGroup];
      
      if (fullWidth) {
        classes.push(styles.full);
      }
      
      if (containerClassName) {
        classes.push(containerClassName);
      }
      
      return classes.join(' ');
    };
    
    return (
      <div className={getContainerClasses()}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={getInputClasses()}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }
);

// Add display name for React DevTools
Input.displayName = 'Input';
 