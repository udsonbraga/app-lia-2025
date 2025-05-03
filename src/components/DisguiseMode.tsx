
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/supabase";

// Componentes refatorados
import { Header } from "@/components/disguise/Header";
import { CategoryFilter } from "@/components/disguise/CategoryFilter";
import { ProductGrid } from "@/components/disguise/ProductGrid";
import { ProductPagination } from "@/components/disguise/ProductPagination";
import { LoadingOverlay } from "@/components/disguise/LoadingOverlay";
import { EditProductModal } from "@/components/disguise/modals/EditProductModal";
import { AddProductModal } from "@/components/disguise/modals/AddProductModal";
import { DeleteProductModal } from "@/components/disguise/modals/DeleteProductModal";

export function DisguiseMode() {
  const navigate = useNavigate();
  const { 
    exitDisguiseMode, 
    getProducts, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    initializeProducts,
    isLoading 
  } = useDisguiseMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  // Carregar produtos do serviço de dados
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);

      // Se não há produtos e ainda não carregou os dados, inicialize o banco
      if (data.length === 0 && !isDataLoaded) {
        await initializeProducts();
        // Tenta carregar novamente depois da inicialização
        const refreshedData = await getProducts();
        setProducts(refreshedData);
      }
      
      setIsDataLoaded(true);
    };

    loadProducts();
  }, [getProducts, initializeProducts, isDataLoaded]);

  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);

  // Get current products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExitDisguise = () => {
    exitDisguiseMode();
  };

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

  const handleSaveEdit = async () => {
    if (!currentProduct) return;

    // Validate inputs
    if (!editedName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    const priceNumber = parseFloat(editedPrice);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser um número positivo.",
        variant: "destructive"
      });
      return;
    }

    if (!editedImage.trim()) {
      toast({
        title: "Erro",
        description: "A URL da imagem não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    if (!editedCategory.trim()) {
      toast({
        title: "Erro",
        description: "A categoria não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    // Update product
    const updatedProduct = { 
      ...currentProduct, 
      name: editedName, 
      price: priceNumber, 
      image: editedImage,
      category: editedCategory 
    };
    
    const updatedProducts = await updateProduct(updatedProduct);
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
  };

  const handleAddProduct = async () => {
    // Validate inputs
    if (!editedName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    const priceNumber = parseFloat(editedPrice);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser um número positivo.",
        variant: "destructive"
      });
      return;
    }

    if (!editedImage.trim()) {
      toast({
        title: "Erro",
        description: "A URL da imagem não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    if (!editedCategory.trim()) {
      toast({
        title: "Erro",
        description: "A categoria não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    // Add new product
    const newProduct = {
      name: editedName, 
      price: priceNumber, 
      image: editedImage,
      category: editedCategory 
    };
    
    const updatedProducts = await addProduct(newProduct);
    setProducts(updatedProducts);
    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    const updatedProducts = await deleteProduct(currentProduct.id);
    setProducts(updatedProducts);
    setIsDeleteModalOpen(false);
  };

  if (isLoading && products.length === 0) {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onExitDisguise={handleExitDisguise} onAddProduct={openAddModal} />

      {/* Category Filter */}
      <div className="container mx-auto pt-20 pb-4">
        <CategoryFilter category={category} setCategory={setCategory} />
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-20">
        <ProductGrid 
          products={currentProducts} 
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
        onAdd={handleAddProduct}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal 
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={currentProduct}
        onDelete={handleDeleteProduct}
        isLoading={isLoading}
      />
    </div>
  );
}
