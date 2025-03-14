import { ReactNode } from "react";

import { ModalSize } from "../../Modal";

// Modal configuration type
export interface ModalConfig {
    title: string;
    content: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    closeOnOutsideClick?: boolean;
  }
  
  // Modal context type
export interface ModalContextType {
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
  }