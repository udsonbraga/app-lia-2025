
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { countProducts, createSampleProducts } from '@/services/productService';
import { Product } from '@/lib/supabase';

// Função para verificar produtos no localStorage
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

export const useProductInitialization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createLocalSampleProducts = (): Product[] => {
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
    return sampleProducts;
  };

  const initializeProducts = async () => {
    setIsLoading(true);
    try {
      // Verificar produtos no localStorage
      const localProducts = getLocalProducts();
      
      // Se já temos produtos localmente, não precisamos inicializar
      if (localProducts.length > 0) {
        setIsLoading(false);
        return;
      }
      
      // Tentar inicializar com o banco de dados
      try {
        // Verifica se já existem produtos
        const { count, error: countError } = await countProducts();
        
        if (countError) {
          throw new Error('Erro ao contar produtos');
        }

        // Se não há produtos, crie uma amostra
        if (count === 0) {
          const { error } = await createSampleProducts();
          if (error) {
            throw new Error('Erro ao criar produtos de amostra');
          } else {
            toast({
              title: "Banco de dados inicializado",
              description: "Produtos de exemplo foram criados com sucesso.",
            });
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar produtos no banco:', error);
        
        // Se falhar, usar dados locais
        const sampleProducts = createLocalSampleProducts();
        saveLocalProducts(sampleProducts);
        localStorage.setItem('useLocalStorage', 'true');
        
        toast({
          title: "Modo local ativado",
          description: "Produtos de exemplo foram criados localmente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    initializeProducts
  };
};
