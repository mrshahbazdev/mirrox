import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert', // alert, confirm, prompt
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    placeholder: '',
    status: 'info', // success, error, info, warning
    inputValue: ''
  });

  const showAlert = useCallback((message, title = 'Notification', status = 'info') => {
    setModal({
      isOpen: true,
      type: 'alert',
      title,
      message,
      status,
      onConfirm: () => closeModal()
    });
  }, []);

  const showConfirm = useCallback((message, title = 'Are you sure?', onConfirm) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      status: 'warning',
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: () => closeModal()
    });
  }, []);

  const showPrompt = useCallback((message, title = 'Input Required', onConfirm, placeholder = '') => {
    setModal({
      isOpen: true,
      type: 'prompt',
      title,
      message,
      status: 'info',
      placeholder,
      inputValue: '',
      onConfirm: (val) => {
        if (onConfirm) onConfirm(val);
        closeModal();
      },
      onCancel: () => closeModal()
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, showPrompt, closeModal, modal, setModal }}>
      {children}
    </ModalContext.Provider>
  );
};
