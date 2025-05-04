
import { useState, useEffect } from "react";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { Product } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";

export const useDisguiseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { 
    getProducts, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    initializeProducts,
    isLoading 
  } = useDisguiseMode();

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);

      // If no products and not loaded data yet, initialize the database
      if (data.length === 0 && !isDataLoaded) {
        await initializeProducts();
        // Reload after initialization
        const refreshedData = await getProducts();
        setProducts(refreshedData);
      }
      
      setIsDataLoaded(true);
    };

    loadProducts();
  }, [getProducts, initializeProducts, isDataLoaded]);

  // Filter products based on selected category
  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);

  // Get current page products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    // Validate inputs
    if (!updatedProduct.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(updatedProduct.price) || updatedProduct.price <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser um número positivo.",
        variant: "destructive"
      });
      return false;
    }

    if (!updatedProduct.image.trim()) {
      toast({
        title: "Erro",
        description: "A URL da imagem não pode estar vazia.",
        variant: "destructive"
      });
      return false;
    }

    if (!updatedProduct.category.trim()) {
      toast({
        title: "Erro",
        description: "A categoria não pode estar vazia.",
        variant: "destructive"
      });
      return false;
    }

    // Update product
    const updatedProducts = await updateProduct(updatedProduct);
    setProducts(updatedProducts);
    return true;
  };

  const handleAddProduct = async (name: string, price: string, image: string, category: string) => {
    // Validate inputs
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
        variant: "destructive"
      });
      return false;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser um número positivo.",
        variant: "destructive"
      });
      return false;
    }

    if (!image.trim()) {
      toast({
        title: "Erro",
        description: "A URL da imagem não pode estar vazia.",
        variant: "destructive"
      });
      return false;
    }

    if (!category.trim()) {
      toast({
        title: "Erro",
        description: "A categoria não pode estar vazia.",
        variant: "destructive"
      });
      return false;
    }

    // Add new product
    const newProduct = {
      name, 
      price: priceNumber, 
      image,
      category 
    };
    
    const updatedProducts = await addProduct(newProduct);
    setProducts(updatedProducts);
    return true;
  };

  const handleDeleteProduct = async (productId: number) => {
    const updatedProducts = await deleteProduct(productId);
    setProducts(updatedProducts);
    return true;
  };

  return {
    products: currentProducts,
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
  };
};
