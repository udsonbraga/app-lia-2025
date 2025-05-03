import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/supabase';

// Contador de produtos para setup inicial
export const countProducts = async () => {
  try {
    return await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
  } catch (error) {
    console.error('Erro ao contar produtos:', error);
    return { count: 0, error };
  }
};

// Criação de produtos de exemplo
export const createSampleProducts = async () => {
  try {
    const sampleProducts = [
      {
        name: "Camisa Floral",
        price: 79.90,
        category: "Roupas",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
      },
      {
        name: "Tênis Casual",
        price: 129.90,
        category: "Calçados",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      },
      {
        name: "Bolsa de Couro",
        price: 149.90,
        category: "Acessórios",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80"
      },
      {
        name: "Vestido Elegante",
        price: 199.90,
        category: "Roupas",
        image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
      },
      {
        name: "Óculos de Sol",
        price: 89.90,
        category: "Acessórios",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
      }
    ];

    return await supabase.from('products').insert(sampleProducts);
  } catch (error) {
    console.error('Erro ao criar produtos de exemplo:', error);
    return { error };
  }
};

// Funções para interagir com produtos
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return { success: false, error };
  }
};

export const addProductToDB = async (product: Omit<Product, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
      
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, error };
  }
};

export const updateProductInDB = async (product: Product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .select();
      
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error };
  }
};

export const deleteProductFromDB = async (id: number) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return { success: false, error };
  }
};
