'use client';

import React from 'react';

import { Button } from '@/components/common/Button';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import styles from './FieldList.module.scss';
import { FieldListProps } from './types';

export const FieldList: React.FC<FieldListProps> = ({
  fields,
  isViewOnly,
  onAddField,
  onDeleteField,
  onReorderFields,
  addButtonLabel = 'Add Field',
  emptyMessage = 'No fields added yet. Click "Add Field" to add form fields.'
}) => {
  const { 
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  } = useDragAndDrop({
    items: fields,
    onReorder: (reorderedItems) => {
      if (onReorderFields) {
        onReorderFields(reorderedItems);
      }
    }
  });

  const handleAddFieldClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddField();
  };

  const handleDeleteField = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    if (onDeleteField) {
      onDeleteField(fieldId);
    }
  };

  const isDragEnabled = !isViewOnly && onReorderFields !== undefined;

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
            <div 
              key={field.id} 
              className={`${styles.fieldItem} ${draggedItem?.id === field.id ? styles.dragging : ''}`}
              draggable={isDragEnabled}
              onDragStart={isDragEnabled ? (e) => handleDragStart(e, field) : undefined}
              onDragOver={isDragEnabled ? handleDragOver : undefined}
              onDrop={isDragEnabled ? (e) => handleDrop(e, field) : undefined}
              onDragEnd={isDragEnabled ? handleDragEnd : undefined}
            >
              <div className={styles.fieldInfo}>
                {isDragEnabled && (
                  <span className={styles.dragHandle} title="Drag to reorder">
                    ⋮⋮
                  </span>
                )}
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