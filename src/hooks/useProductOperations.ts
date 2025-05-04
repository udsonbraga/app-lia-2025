
import { useState, useEffect } from 'react';
import { Product } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useProductInitialization } from './useProductInitialization';
import { 
  fetchProducts, 
  updateProductInDB, 
  addProductToDB, 
  deleteProductFromDB 
} from '@/services/productService';

// Função para obter produtos do localStorage
const getLocalProducts = (): Product[] => {
  try {
    const storedProducts = localStorage.getItem('localProducts');
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Erro ao ler produtos do localStorage:', error);
    return [];
  }
};

// Função para salvar produtos no localStorage
const saveLocalProducts = (products: Product[]) => {
  try {
    localStorage.setItem('localProducts', JSON.stringify(products));
  } catch (error) {
    console.error('Erro ao salvar produtos no localStorage:', error);
  }
};

export const useProductOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(true); // Por padrão, usar localStorage
  const { toast } = useToast();
  const { initializeProducts: initProducts, isLoading: isInitializing } = useProductInitialization();

  useEffect(() => {
    // Verificar se devemos usar localStorage baseado em falhas anteriores
    const shouldUseLocal = localStorage.getItem('useLocalStorage');
    if (shouldUseLocal !== null) {
      setUseLocalStorage(shouldUseLocal === 'true');
    }
  }, []);

  const initializeProducts = async () => {
    setIsLoading(true);
    try {
      if (useLocalStorage) {
        // Verificar se já temos produtos no localStorage
        const localProducts = getLocalProducts();
        if (localProducts.length === 0) {
          // Se não tiver produtos locais, tenta inicializar do banco de dados
          await initProducts();
          // Em seguida, busca os produtos para armazenamento local
          const { data, success } = await fetchProducts();
          if (success && data && data.length > 0) {
            saveLocalProducts(data as Product[]);
          } else {
            // Se falhar em buscar do banco, criar produtos de exemplo localmente
            const sampleProducts: Product[] = [
              {
                id: 1,
                name: "Camisa Floral",
                price: 79.90,
                category: "Roupas",
                image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              },
              {
                id: 2,
                name: "Tênis Casual",
                price: 129.90,
                category: "Calçados",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              },
              {
                id: 3,
                name: "Bolsa de Couro",
                price: 149.90,
                category: "Acessórios",
                image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80"
              },
              {
                id: 4,
                name: "Vestido Elegante",
                price: 199.90,
                category: "Roupas",
                image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
              },
              {
                id: 5,
                name: "Óculos de Sol",
                price: 89.90,
                category: "Acessórios",
                image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
              }
            ];
            saveLocalProducts(sampleProducts);
            toast({
              title: "Dados locais criados",
              description: "Produtos de exemplo foram criados localmente.",
            });
          }
        }
      } else {
        // Tenta inicializar normalmente do banco de dados
        await initProducts();
      }
    } catch (error) {
      console.error('Erro ao inicializar produtos:', error);
      setUseLocalStorage(true);
      localStorage.setItem('useLocalStorage', 'true');
      toast({
        title: "Modo offline ativado",
        description: "Seus dados serão armazenados localmente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter produtos
  const getProducts = async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      if (useLocalStorage) {
        // Buscar produtos do localStorage
        return getLocalProducts();
      } else {
        // Tentar buscar do banco de dados
        try {
          const { data, error, success } = await fetchProducts();
          
          if (!success || error) {
            throw new Error('Erro ao buscar produtos do banco de dados');
          }
          
          return data as Product[] || [];
        } catch (error) {
          console.error('Erro ao buscar produtos do banco:', error);
          setUseLocalStorage(true);
          localStorage.setItem('useLocalStorage', 'true');
          toast({
            title: "Usando dados locais",
            description: "Erro ao acessar o banco de dados. Usando dados locais.",
            variant: "destructive"
          });
          return getLocalProducts();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (updatedProduct: Product): Promise<Product[]> => {
    setIsLoading(true);
    try {
      if (useLocalStorage) {
        // Atualizar produto localmente
        const products = getLocalProducts();
        const updatedProducts = products.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
        saveLocalProducts(updatedProducts);
        toast({
          title: "Produto atualizado",
          description: "Produto atualizado localmente com sucesso.",
        });
        return updatedProducts;
      } else {
        // Tentar atualizar no banco de dados
        try {
          const { error } = await updateProductInDB(updatedProduct);
          
          if (error) {
            throw new Error('Erro ao atualizar no banco de dados');
          }
          
          toast({
            title: "Produto atualizado",
            description: "Produto atualizado com sucesso.",
          });
          
          return await getProducts();
        } catch (error) {
          console.error('Erro ao atualizar produto no banco:', error);
          setUseLocalStorage(true);
          localStorage.setItem('useLocalStorage', 'true');
          
          // Atualizar localmente após falha no banco
          const products = getLocalProducts();
          const updatedProducts = products.map(product => 
            product.id === updatedProduct.id ? updatedProduct : product
          );
          saveLocalProducts(updatedProducts);
          
          toast({
            title: "Modo offline ativado",
            description: "Produto atualizado localmente.",
            variant: "default"
          });
          
          return updatedProducts;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>): Promise<Product[]> => {
    setIsLoading(true);
    try {
      if (useLocalStorage) {
        // Adicionar produto localmente
        const products = getLocalProducts();
        // Gerar ID local
        const maxId = products.length > 0 
          ? Math.max(...products.map(p => p.id)) 
          : 0;
        const productWithId = { 
          ...newProduct, 
          id: maxId + 1 
        };
        const updatedProducts = [...products, productWithId];
        saveLocalProducts(updatedProducts);
        toast({
          title: "Produto adicionado",
          description: "Produto adicionado localmente com sucesso.",
        });
        return updatedProducts;
      } else {
        // Tentar adicionar no banco de dados
        try {
          const { error } = await addProductToDB(newProduct);
          
          if (error) {
            throw new Error('Erro ao adicionar no banco de dados');
          }
          
          toast({
            title: "Produto adicionado",
            description: "Produto adicionado com sucesso.",
          });
          
          return await getProducts();
        } catch (error) {
          console.error('Erro ao adicionar produto no banco:', error);
          setUseLocalStorage(true);
          localStorage.setItem('useLocalStorage', 'true');
          
          // Adicionar localmente após falha no banco
          const products = getLocalProducts();
          const maxId = products.length > 0 
            ? Math.max(...products.map(p => p.id)) 
            : 0;
          const productWithId = { 
            ...newProduct, 
            id: maxId + 1 
          };
          const updatedProducts = [...products, productWithId];
          saveLocalProducts(updatedProducts);
          
          toast({
            title: "Modo offline ativado",
            description: "Produto adicionado localmente.",
            variant: "default"
          });
          
          return updatedProducts;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<Product[]> => {
    setIsLoading(true);
    try {
      if (useLocalStorage) {
        // Excluir produto localmente
        const products = getLocalProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        saveLocalProducts(updatedProducts);
        toast({
          title: "Produto excluído",
          description: "Produto excluído localmente com sucesso.",
        });
        return updatedProducts;
      } else {
        // Tentar excluir do banco de dados
        try {
          const { error } = await deleteProductFromDB(id);
          
          if (error) {
            throw new Error('Erro ao excluir do banco de dados');
          }
          
          toast({
            title: "Produto excluído",
            description: "Produto excluído com sucesso.",
          });
          
          return await getProducts();
        } catch (error) {
          console.error('Erro ao excluir produto do banco:', error);
          setUseLocalStorage(true);
          localStorage.setItem('useLocalStorage', 'true');
          
          // Excluir localmente após falha no banco
          const products = getLocalProducts();
          const updatedProducts = products.filter(product => product.id !== id);
          saveLocalProducts(updatedProducts);
          
          toast({
            title: "Modo offline ativado",
            description: "Produto excluído localmente.",
            variant: "default"
          });
          
          return updatedProducts;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Opção para alternar entre armazenamento local e banco de dados
  const toggleStorageMode = () => {
    const newMode = !useLocalStorage;
    setUseLocalStorage(newMode);
    localStorage.setItem('useLocalStorage', newMode.toString());
    toast({
      title: newMode ? "Modo offline ativado" : "Modo online ativado",
      description: newMode ? "Dados serão armazenados localmente." : "Dados serão sincronizados com o banco.",
    });
  };

  return {
    isLoading: isLoading || isInitializing,
    initializeProducts,
    getProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    useLocalStorage,
    toggleStorageMode
  };
};
