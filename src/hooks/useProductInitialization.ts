
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { countProducts, createSampleProducts } from '@/services/productService';

export const useProductInitialization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializeProducts = async () => {
    setIsLoading(true);
    try {
      // Verifica se já existem produtos
      const { count, error: countError } = await countProducts();
      
      if (countError) {
        console.error('Erro ao contar produtos:', countError);
      }

      // Se não há produtos, crie uma amostra
      if (count === 0) {
        const { error } = await createSampleProducts();
        if (error) {
          console.error('Erro ao criar produtos de amostra:', error);
        } else {
          toast({
            title: "Banco de dados inicializado",
            description: "Produtos de exemplo foram criados com sucesso.",
          });
        }
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

  return {
    isLoading,
    initializeProducts
  };
};
