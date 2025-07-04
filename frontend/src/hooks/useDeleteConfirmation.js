import { useState } from 'react';

export const useDeleteConfirmation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({
    onConfirm: () => {},
    title: "Delete Confirmation",
    message: "Are you sure you want to delete this item?",
    itemName: "",
    confirmText: "Delete",
    cancelText: "Cancel",
    isLoading: false
  });

  const openDeleteModal = (config) => {
    setDeleteConfig(prevConfig => ({
      ...prevConfig,
      ...config
    }));
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setDeleteConfig(prevConfig => ({
      ...prevConfig,
      isLoading: false
    }));
  };

  const setLoading = (loading) => {
    setDeleteConfig(prevConfig => ({
      ...prevConfig,
      isLoading: loading
    }));
  };

  return {
    isModalOpen,
    deleteConfig,
    openDeleteModal,
    closeDeleteModal,
    setLoading
  };
};