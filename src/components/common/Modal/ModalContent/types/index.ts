import { ReactNode } from "react";

import { ModalSize } from "../../types";

export interface ModalConfig {
    title: string;
    content: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    closeOnOutsideClick?: boolean;
  }
  
export interface ModalContextType {
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
  }