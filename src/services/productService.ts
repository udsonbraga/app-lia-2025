
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/supabase';

// Contador de produtos para setup inicial
export const countProducts = async () => {
  try {
    // Verificamos se a tabela de produtos existe
    const { data, error } = await supabase.rpc('count_products', {});
    
    if (error && error.message.includes('does not exist')) {
      // A tabela não existe, retornamos 0
      return { count: 0, error: null };
    } else if (error) {
      console.error('Erro ao contar produtos:', error);
      return { count: 0, error };
    }
    
    return { count: data || 0, error: null };
  } catch (error) {
    console.error('Erro ao contar produtos:', error);
    return { count: 0, error };
  }
};

// Criação de produtos de exemplo
export const createSampleProducts = async () => {
  try {
    // Verificar se a tabela de produtos existe
    const { error: tableError } = await supabase.rpc('check_table_exists', { table_name: 'products' });
    
    // Se a tabela não existir, criamos ela
    if (tableError && tableError.message.includes('does not exist')) {
      // Criar tabela de produtos
      await supabase.rpc('create_products_table', {});
    }
    
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

    // Inserir produtos usando RPC para contornar restrição de tabela
    for (const product of sampleProducts) {
      await supabase.rpc('insert_product', {
        p_name: product.name,
        p_price: product.price,
        p_category: product.category,
        p_image: product.image
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar produtos de exemplo:', error);
    return { error };
  }
};

// Funções para interagir com produtos
export const fetchProducts = async () => {
  try {
    // Verificar se a tabela existe
    const { data: exists, error: existsError } = await supabase.rpc('check_table_exists', { table_name: 'products' });
    
    if (existsError || !exists) {
      // Se a tabela não existir ou houver erro, retornamos uma lista vazia
      return { success: true, data: [] };
    }
    
    // Buscar produtos usando RPC
    const { data, error } = await supabase.rpc('get_all_products', {});
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return { success: false, error, data: [] };
  }
};

export const addProductToDB = async (product: Omit<Product, 'id'>) => {
  try {
    // Inserir produto usando RPC
    const { data, error } = await supabase.rpc('insert_product', {
      p_name: product.name,
      p_price: product.price,
      p_category: product.category,
      p_image: product.image
    });
    
    if (error) throw error;
    return { success: true, data: data || {} };
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, error };
  }
};

export const updateProductInDB = async (product: Product) => {
  try {
    // Atualizar produto usando RPC
    const { data, error } = await supabase.rpc('update_product', {
      p_id: product.id,
      p_name: product.name,
      p_price: product.price,
      p_category: product.category,
      p_image: product.image
    });
    
    if (error) throw error;
    return { success: true, data: data || {} };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error };
  }
};

export const deleteProductFromDB = async (id: number) => {
  try {
    // Deletar produto usando RPC
    const { error } = await supabase.rpc('delete_product', { p_id: id });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return { success: false, error };
  }
};
