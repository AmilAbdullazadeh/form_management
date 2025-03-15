'use client';

import React from 'react';

import { Plus } from '@/assets/icons/Plus';
import { Button } from '@/components/common/Button';
import { FORM_FIELD_LABELS, FORM_EMPTY_STATES } from '@/constants/form';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import styles from './FieldList.module.scss';
import { FieldListProps } from './types';


export const FieldList: React.FC<FieldListProps> = ({
  fields,
  isViewOnly,
  onAddField,
  onDeleteField,
  onReorderFields,
  addButtonLabel = FORM_FIELD_LABELS.ADD_FIELD,
  emptyMessage = FORM_EMPTY_STATES.NO_FIELDS_ADDED
}) => {
  const { 
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

  const handleDeleteField = (e: React.MouseEvent, fieldName: string) => {
    e.preventDefault();
    if (onDeleteField) {
      onDeleteField(fieldName);
    }
  };

  const isDragEnabled = !isViewOnly && onReorderFields !== undefined;

  return (
    <div className={styles.fieldsSection}>
      <div className={styles.fieldsSectionHeader}>
        <h3>{FORM_FIELD_LABELS.FORM_FIELDS}</h3>
        <Button
          variant="primary"
          size="md"
          onClick={handleAddFieldClick}
          disabled={isViewOnly}
          type="button"
          icon={<Plus />}
        >
          {addButtonLabel}
        </Button>
      </div>
      
      {fields.length > 0 ? (
        <div className={styles.fieldsList}>
          {fields.map(field => (
            <div 
              key={field.name} 
              className={`${styles.fieldItem} ${draggedItem?.name === field.name ? styles.dragging : ''}`}
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
                <span className={styles.fieldLabel}>{field.name}</span>
                <span className={styles.fieldType}>{field.type}</span>
                {field.isRequired && <span className={styles.fieldRequired}>Required</span>}
              </div>
              {!isViewOnly && onDeleteField && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => handleDeleteField(e, field.name)}
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