
import { useState } from "react";
import { Product } from "@/lib/supabase";

export const useProductEditing = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setEditedName(product.name);
    setEditedPrice(product.price.toString());
    setEditedImage(product.image);
    setEditedCategory(product.category);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setEditedName("");
    setEditedPrice("");
    setEditedImage("");
    setEditedCategory("");
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const resetEditState = () => {
    setCurrentProduct(null);
    setEditedName("");
    setEditedPrice("");
    setEditedImage("");
    setEditedCategory("");
  };

  return {
    currentProduct,
    editedName,
    setEditedName,
    editedPrice,
    setEditedPrice,
    editedImage,
    setEditedImage,
    editedCategory,
    setEditedCategory,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    openEditModal,
    openAddModal,
    openDeleteModal,
    resetEditState
  };
};
