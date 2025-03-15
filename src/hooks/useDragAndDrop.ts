'use client';

import React, { useCallback, useRef, useState } from 'react';

import { FormField } from '@/types/api';

interface UseDragAndDropProps {
  items: FormField[];
  onReorder: (newItems: FormField[]) => void;
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
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.name);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>, targetItem: FormField) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.name === targetItem.name) {
      return;
    }
    
    const currentItems = [...items];
    const draggedItemIndex = currentItems.findIndex(item => item.name === draggedItem.name);
    const targetItemIndex = currentItems.findIndex(item => item.name === targetItem.name);
    
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