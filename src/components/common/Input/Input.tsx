import React, { InputHTMLAttributes, forwardRef } from 'react';

import { ErrorMessage } from '@/components/common/ErrorMessage';

import styles from './Input.module.scss';

// Define a configuration object for the input field
export interface InputConfig {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
}

// Extend HTML input props with our configuration
export type InputProps = InputHTMLAttributes<HTMLInputElement> & InputConfig;

/**
 * Reusable Input component with simplified props
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', containerClassName = '', ...props }, ref) => {
    // Generate input classes based on props
    const getInputClasses = () => {
      const classes = [styles.input];

      // Add error class if needed
      if (error) {
        classes.push(styles.error);
      }

      // Add full width class if needed
      if (fullWidth) {
        classes.push(styles.full);
      }

      // Add custom class if provided
      if (className) {
        classes.push(className);
      }

      return classes.join(' ');
    };

    // Generate container classes based on props
    const getContainerClasses = () => {
      const classes = [styles.formGroup];

      // Add full width class if needed
      if (fullWidth) {
        classes.push(styles.full);
      }

      // Add custom class if provided
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
