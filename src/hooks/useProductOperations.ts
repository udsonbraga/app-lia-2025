
import { useState } from 'react';
import { Product } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useProductInitialization } from './useProductInitialization';
import { 
  fetchProducts, 
  updateProductInDB, 
  addProductToDB, 
  deleteProductFromDB 
} from '@/services/productService';

export const useProductOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { initializeProducts: initProducts, isLoading: isInitializing } = useProductInitialization();

  const initializeProducts = async () => {
    await initProducts();
  };

  // Function to get products from the database
  const getProducts = async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await fetchProducts();
      
      if (error) {
        console.error('Erro ao buscar produtos:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Verifique sua conexão e tente novamente.",
          variant: "destructive"
        });
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (updatedProduct: Product): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { error } = await updateProductInDB(updatedProduct);
      
      if (error) {
        console.error('Erro ao atualizar produto:', error);
        toast({
          title: "Erro ao atualizar produto",
          description: "Verifique sua conexão e tente novamente.",
          variant: "destructive"
        });
        return await getProducts();
      }
      
      toast({
        title: "Produto atualizado",
        description: "Produto atualizado com sucesso.",
      });
      
      return await getProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { error } = await addProductToDB(newProduct);
      
      if (error) {
        console.error('Erro ao adicionar produto:', error);
        toast({
          title: "Erro ao adicionar produto",
          description: "Verifique sua conexão e tente novamente.",
          variant: "destructive"
        });
        return await getProducts();
      }
      
      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso.",
      });
      
      return await getProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { error } = await deleteProductFromDB(id);
      
      if (error) {
        console.error('Erro ao excluir produto:', error);
        toast({
          title: "Erro ao excluir produto",
          description: "Verifique sua conexão e tente novamente.",
          variant: "destructive"
        });
        return await getProducts();
      }
      
      toast({
        title: "Produto excluído",
        description: "Produto excluído com sucesso.",
      });
      
      return await getProducts();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading: isLoading || isInitializing,
    initializeProducts,
    getProducts,
    updateProduct,
    addProduct,
    deleteProduct
  };
};
