import React from 'react';

import styles from './Button.module.scss';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  icon,
  ...props
}) => {
  // classes for the button based on props
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
      {icon && icon}
      {children && <span className={isLoading ? styles.spinnerText : ''}>{children}</span>}
    </button>
  );
};
