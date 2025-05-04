
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/supabase';

// Função para buscar todos os produtos
export const fetchAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    return { success: false, error: error.message };
  }
};

// Função para buscar produtos por categoria
export const fetchProductsByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
    return { success: false, error: error.message };
  }
};

// Função para buscar um produto específico
export const fetchProductById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error(`Erro ao buscar produto ID ${id}:`, error);
    return { success: false, error: error.message };
  }
};

// Função para criar um novo produto
export const createProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
      
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return { success: false, error: error.message };
  }
};

// Função para atualizar um produto existente
export const updateProduct = async (id: number, updates: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error(`Erro ao atualizar produto ID ${id}:`, error);
    return { success: false, error: error.message };
  }
};

// Função para excluir um produto
export const deleteProduct = async (id: number) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error(`Erro ao excluir produto ID ${id}:`, error);
    return { success: false, error: error.message };
  }
};

// Função para buscar todas as categorias distintas
export const fetchAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');
      
    if (error) throw error;
    
    // Remove duplicates and null values
    const categories = [...new Set(data.map(item => item.category))]
      .filter(category => category)
      .sort();
      
    return { success: true, data: categories };
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    return { success: false, error: error.message };
  }
};

// Função para contar produtos por categoria
export const countProductsByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category');
      
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const category = item.category || 'Sem categoria';
      counts[category] = (counts[category] || 0) + 1;
    });
    
    return { success: true, data: counts };
  } catch (error: any) {
    console.error('Erro ao contar produtos por categoria:', error);
    return { success: false, error: error.message };
  }
};
