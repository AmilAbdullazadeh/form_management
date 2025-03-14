'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Modal } from './Modal';
import { ModalConfig } from './types';

// Modal context type
interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

// Create context with default values
const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

// Hook to use the modal context
export const useModal = () => useContext(ModalContext);

// Modal provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  // Open modal with configuration
  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modalConfig && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalConfig.title}
          size={modalConfig.size}
          closeOnOutsideClick={modalConfig.closeOnOutsideClick}
          footer={modalConfig.footer}
        >
          {modalConfig.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};
