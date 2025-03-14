import React, { forwardRef } from 'react';

import styles from './Checkbox.module.scss';
import { CheckboxProps } from './types';

/**
 *
 * @param label - Checkbox label
 * @param error - Error message
 * @param helperText - Helper text
 * @param className - Additional CSS class for the checkbox
 * @param containerClassName - Additional CSS class for the container
 * @param props - Additional checkbox props
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', containerClassName = '', ...props }, ref) => {
    // Generate checkbox classes based on props
    const getCheckboxClasses = () => {
      const classes = [styles.checkbox];

      if (error) {
        classes.push(styles.error);
      }

      if (className) {
        classes.push(className);
      }

      return classes.join(' ');
    };

    // Generate container classes based on props
    const getContainerClasses = () => {
      const classes = [styles.checkboxGroup];

      if (containerClassName) {
        classes.push(containerClassName);
      }

      return classes.join(' ');
    };

    return (
      <div className={getContainerClasses()}>
        <div className={styles.container}>
          <input
            ref={ref}
            type="checkbox"
            className={getCheckboxClasses()}
            id={props.id}
            {...props}
          />
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
