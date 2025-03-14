'use client';

import React, { useCallback, useRef, useState } from 'react';

import { FormField } from '@/types/form';

interface UseDragAndDropProps {
  items: FormField[];
  onReorder: (reorderedItems: FormField[]) => void;
}

export const useDragAndDrop = ({ items, onReorder }: UseDragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<FormField | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const draggedNodeRef = useRef<HTMLElement | null>(null);
  
  const handleDragStart = useCallback((e: React.DragEvent<HTMLElement>, item: FormField) => {
    draggedNodeRef.current = e.currentTarget;
    
    if (draggedNodeRef.current) {
      setTimeout(() => {
        if (draggedNodeRef.current) {
          draggedNodeRef.current.style.opacity = '0.4';
        }
      }, 0);
    }
    
    setDraggedItem(item);
    setIsDragging(true);
    
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>, targetItem: FormField) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }
    
    const currentItems = [...items];
    const draggedItemIndex = currentItems.findIndex(item => item.id === draggedItem.id);
    const targetItemIndex = currentItems.findIndex(item => item.id === targetItem.id);
    
    if (draggedItemIndex === -1 || targetItemIndex === -1) {
      return;
    }
    
    const [removedItem] = currentItems.splice(draggedItemIndex, 1);
    
    currentItems.splice(targetItemIndex, 0, removedItem);
    
    onReorder(currentItems);
    
    setDraggedItem(null);
    setIsDragging(false);
  }, [draggedItem, items, onReorder]);
  
  const handleDragEnd = useCallback(() => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.style.opacity = '1';
      draggedNodeRef.current = null;
    }
    
    setDraggedItem(null);
    setIsDragging(false);
  }, []);
  
  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}; 