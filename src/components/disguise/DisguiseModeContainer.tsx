
import React from "react";
import { Loader2 } from "lucide-react";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useDisguiseProducts } from "@/hooks/useDisguiseProducts";
import { useProductEditing } from "./hooks/useProductEditing";
import { Product } from "@/lib/supabase";

// Components
import { Header } from "./Header";
import { CategoryFilter } from "./CategoryFilter";
import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";
import { LoadingOverlay } from "./LoadingOverlay";
import { EditProductModal } from "./modals/EditProductModal";
import { AddProductModal } from "./modals/AddProductModal";
import { DeleteProductModal } from "./modals/DeleteProductModal";

export function DisguiseModeContainer() {
  const { exitDisguiseMode } = useDisguiseMode();
  const {
    products,
    totalPages,
    currentPage,
    category,
    isLoading,
    isDataLoaded,
    handlePageChange,
    setCategory,
    handleUpdateProduct,
    handleAddProduct,
    handleDeleteProduct
  } = useDisguiseProducts();

  const {
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
    openDeleteModal
  } = useProductEditing();

  const handleExitDisguise = () => {
    exitDisguiseMode();
  };

  const handleSaveEdit = async () => {
    if (!currentProduct) return;

    const updatedProduct = { 
      ...currentProduct, 
      name: editedName, 
      price: parseFloat(editedPrice), 
      image: editedImage,
      category: editedCategory 
    };
    
    const success = await handleUpdateProduct(updatedProduct);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  const handleAddProductSubmit = async () => {
    const success = await handleAddProduct(
      editedName, 
      editedPrice, 
      editedImage, 
      editedCategory
    );
    
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteProductSubmit = async () => {
    if (!currentProduct) return;
    
    const success = await handleDeleteProduct(currentProduct.id);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading && !isDataLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <Header onExitDisguise={handleExitDisguise} onAddProduct={openAddModal} />

      {/* Category Filter */}
      <div className="container mx-auto pt-24 pb-4">
        <CategoryFilter category={category} setCategory={setCategory} />
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-24">
        <ProductGrid 
          products={products} 
          openEditModal={openEditModal} 
          openDeleteModal={openDeleteModal} 
        />
      </div>

      {/* Pagination */}
      <ProductPagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
      />

      {/* Edit Product Modal */}
      <EditProductModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editedName={editedName}
        setEditedName={setEditedName}
        editedPrice={editedPrice}
        setEditedPrice={setEditedPrice}
        editedImage={editedImage}
        setEditedImage={setEditedImage}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />

      {/* Add Product Modal */}
      <AddProductModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        editedName={editedName}
        setEditedName={setEditedName}
        editedPrice={editedPrice}
        setEditedPrice={setEditedPrice}
        editedImage={editedImage}
        setEditedImage={setEditedImage}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        onAdd={handleAddProductSubmit}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal 
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={currentProduct}
        onDelete={handleDeleteProductSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
