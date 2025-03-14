import React from 'react';

import styles from './Button.module.scss';
import { ButtonProps } from './types';

/**
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

    classes.push(styles[variant]);

    classes.push(styles[size]);

    if (fullWidth) {
      classes.push(styles.full);
    }

    if (isLoading) {
      classes.push(styles.loading);
    }

    if (props.disabled) {
      classes.push(styles.disabled);
    }

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
