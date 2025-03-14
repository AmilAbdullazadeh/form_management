'use client';

import React from 'react';

import { Button } from '@/components/common/Button';

import styles from './FieldList.module.scss';
import { FieldListProps } from './types';

/**
 * Reusable component for displaying and managing a list of form fields
 * Supports adding and deleting fields with proper permissions
 */
export const FieldList: React.FC<FieldListProps> = ({
  fields,
  isViewOnly,
  onAddField,
  onDeleteField,
  addButtonLabel = 'Add Field',
  emptyMessage = 'No fields added yet. Click "Add Field" to add form fields.'
}) => {
  // Prevent form submission when clicking the Add Field button
  const handleAddFieldClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    onAddField();
  };

  // Handle delete field button click
  const handleDeleteField = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault(); // Prevent form submission
    if (onDeleteField) {
      onDeleteField(fieldId);
    }
  };

  return (
    <div className={styles.fieldsSection}>
      <div className={styles.fieldsSectionHeader}>
        <h3>Form Fields</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddFieldClick}
          disabled={isViewOnly}
          type="button"
        >
          {addButtonLabel}
        </Button>
      </div>
      
      {fields.length > 0 ? (
        <div className={styles.fieldsList}>
          {fields.map(field => (
            <div key={field.id} className={styles.fieldItem}>
              <div className={styles.fieldInfo}>
                <span className={styles.fieldLabel}>{field.label}</span>
                <span className={styles.fieldType}>{field.type}</span>
                {field.required && <span className={styles.fieldRequired}>Required</span>}
              </div>
              {!isViewOnly && onDeleteField && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => handleDeleteField(e, field.id)}
                  type="button"
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noFields}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}; 