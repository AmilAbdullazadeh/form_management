import { useState, useCallback } from 'react';

/**
 * @returns Modal state and handlers
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const open = useCallback((modalData?: any) => {
    setIsOpen(true);
    if (modalData !== undefined) {
      setData(modalData);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
} 