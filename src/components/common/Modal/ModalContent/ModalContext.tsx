'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Modal } from '../Modal';

import { ModalConfig, ModalContextType } from './types';

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

/**
 * Modal provider for the modal context
 */
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  };

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