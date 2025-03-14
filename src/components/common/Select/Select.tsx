import React, { SelectHTMLAttributes, forwardRef } from 'react';

import { ErrorMessage } from '@/components/common/ErrorMessage';

import styles from './Select.module.scss';
import { SelectConfig } from './types';

// Extend HTML select props with our configuration
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & SelectConfig;

/**
 * Reusable Select component with simplified props
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    fullWidth = false, 
    className = '', 
    containerClassName = '',
    options = [],
    ...props 
  }, ref) => {
    // Generate select classes based on props
    const getSelectClasses = () => {
      const classes = [styles.select];
      
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
        <select
          ref={ref}
          className={getSelectClasses()}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }
);

// Add display name for React DevTools
Select.displayName = 'Select'; 