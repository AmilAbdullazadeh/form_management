import React from 'react';

import styles from './FormCard.module.scss';
import { FormCardProps } from './types';

/**
 * FormCard component for displaying form information in a card layout
 */
export const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  badge,
  children,
  footer,
  className = '',
  metadata = [],
  actions,
}) => {
  return (
    <div className={`${styles.formCard} ${className}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {metadata.length > 0 && (
            <div className={styles.meta}>
              {metadata.map((item, index) => (
                <div key={index} className={styles.metaItem}>
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {badge?.map((item, index) => (
            <span key={index} className={`${styles.badge} ${styles[item.variant]}`}>
              {item.text}
            </span>
          ))}

          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>

      {children && <div className={styles.body}>{children}</div>}

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
