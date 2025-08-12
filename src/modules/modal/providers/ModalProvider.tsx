"use client";

import { useState } from "react";
import { ModalContent, ModalContext } from "../contexts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const openModal = (content: ModalContent) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {modalContent && (
          <DialogContent className={modalContent.sizeClassName ?? "max-w-lg"}>
            <DialogHeader>
              <DialogTitle>{modalContent.title}</DialogTitle>
              {modalContent.description && (
                <DialogDescription>
                  {modalContent.description}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="py-4">{modalContent.content}</div>
          </DialogContent>
        )}
      </Dialog>
    </ModalContext.Provider>
  );
}
