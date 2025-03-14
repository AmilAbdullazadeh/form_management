import React from 'react';

import styles from './Button.module.scss';
import { ButtonProps } from './types';

/**
 * Reusable Button component
 *
 * @param variant - Button style variant
 * @param size - Button size
 * @param isLoading - Whether the button is in loading state
 * @param fullWidth - Whether the button should take full width
 * @param className - Additional CSS class
 * @param children - Button content
 * @param props - Additional button props
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  // Generate button classes based on props, if props.disabled is true, the button will be disabled
  const getButtonClasses = () => {
    const classes = [styles.button];

    // Add variant class
    classes.push(styles[variant]);

    // Add size class
    classes.push(styles[size]);

    // Add full width class if needed
    if (fullWidth) {
      classes.push(styles.full);
    }

    // Add loading class if needed
    if (isLoading) {
      classes.push(styles.loading);
    }

    // Add disabled class if needed
    if (props.disabled) {
      classes.push(styles.disabled);
    }

    // Add custom class if provided
    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  };

  return (
    <button className={getButtonClasses()} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className={styles.spinner}></span> : null}
      <span className={isLoading ? styles.spinnerText : ''}>{children}</span>
    </button>
  );
};
