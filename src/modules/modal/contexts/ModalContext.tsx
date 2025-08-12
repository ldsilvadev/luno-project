"use client";

import { createContext, ReactNode} from "react";

export type ModalContent = {
  title: string;
  description?: string;
  content: ReactNode;
  sizeClassName?: string;
};

export type ModalContextType = {
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);
