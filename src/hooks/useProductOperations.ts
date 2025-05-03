
import { useState } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useProductOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Função para inicializar o banco de dados com produtos de exemplo (só deve ser usada uma vez)
  const initializeProducts = async () => {
    setIsLoading(true);
    try {
      // Verifica se já existem produtos
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;

      // Se não há produtos, crie uma amostra
      if (count === 0) {
        const sampleProducts = Array(30).fill(null).map((_, index) => ({
          id: index + 1,
          name: `Product ${index + 1}`,
          price: Math.floor(Math.random() * 150) + 50,
          image: `https://picsum.photos/seed/${index + 1}/300/300`,
          category: ["clothes", "shoes", "accessories"][Math.floor(Math.random() * 3)]
        }));

        const { error } = await supabase.from('products').insert(sampleProducts);
        if (error) throw error;
        
        toast({
          title: "Banco de dados inicializado",
          description: "Produtos de exemplo foram criados com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar produtos:', error);
      toast({
        title: "Erro ao inicializar produtos",
        description: "Não foi possível criar produtos de exemplo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para interagir com os produtos
  const getProducts = async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
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
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          image: updatedProduct.image,
          category: updatedProduct.category
        })
        .eq('id', updatedProduct.id);
      
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
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return await getProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert(newProduct);
      
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
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return await getProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
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
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return await getProducts();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    initializeProducts,
    getProducts,
    updateProduct,
    addProduct,
    deleteProduct
  };
};
