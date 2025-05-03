
import { supabase, Product, supabaseConfigured } from '@/lib/supabase';

// Dados locais para quando não há conexão com o Supabase
const generateLocalProducts = (): Product[] => {
  return Array(30).fill(null).map((_, index) => ({
    id: index + 1,
    name: `Produto ${index + 1}`,
    price: Math.floor(Math.random() * 150) + 50,
    image: `https://picsum.photos/seed/${index + 1}/300/300`,
    category: ["clothes", "shoes", "accessories"][Math.floor(Math.random() * 3)]
  }));
};

// Cache local de produtos
let localProducts: Product[] = [];

// Get all products
export const fetchProducts = async (): Promise<{data: Product[], error: any}> => {
  try {
    // Se o Supabase não está configurado, use dados locais
    if (!supabaseConfigured) {
      console.log('Usando produtos locais (Supabase não configurado)');
      if (localProducts.length === 0) {
        localProducts = generateLocalProducts();
      }
      return { data: localProducts, error: null };
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      // Se houver erro, use dados locais
      if (localProducts.length === 0) {
        localProducts = generateLocalProducts();
      }
      return { data: localProducts, error: null };
    }
    
    return { data, error };
  } catch (error) {
    console.error('Erro em fetchProducts:', error);
    // Se houver exceção, use dados locais
    if (localProducts.length === 0) {
      localProducts = generateLocalProducts();
    }
    return { data: localProducts, error: null };
  }
};

// Update a product
export const updateProductInDB = async (updatedProduct: Product): Promise<{error: any}> => {
  try {
    // Se o Supabase não está configurado, atualize localmente
    if (!supabaseConfigured) {
      localProducts = localProducts.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      );
      return { error: null };
    }
    
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
      // Se houver erro, atualize localmente
      localProducts = localProducts.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      );
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro em updateProductInDB:', error);
    // Se houver exceção, atualize localmente
    localProducts = localProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    return { error: null };
  }
};

// Add a new product
export const addProductToDB = async (newProduct: Omit<Product, 'id'>): Promise<{error: any}> => {
  try {
    // Se o Supabase não está configurado, adicione localmente
    if (!supabaseConfigured) {
      const id = localProducts.length > 0 ? Math.max(...localProducts.map(p => p.id)) + 1 : 1;
      const productWithId = { ...newProduct, id };
      localProducts.push(productWithId);
      return { error: null };
    }
    
    const { error } = await supabase
      .from('products')
      .insert(newProduct);
    
    if (error) {
      // Se houver erro, adicione localmente
      const id = localProducts.length > 0 ? Math.max(...localProducts.map(p => p.id)) + 1 : 1;
      const productWithId = { ...newProduct, id };
      localProducts.push(productWithId);
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro em addProductToDB:', error);
    // Se houver exceção, adicione localmente
    const id = localProducts.length > 0 ? Math.max(...localProducts.map(p => p.id)) + 1 : 1;
    const productWithId = { ...newProduct, id };
    localProducts.push(productWithId);
    return { error: null };
  }
};

// Delete a product
export const deleteProductFromDB = async (id: number): Promise<{error: any}> => {
  try {
    // Se o Supabase não está configurado, delete localmente
    if (!supabaseConfigured) {
      localProducts = localProducts.filter(p => p.id !== id);
      return { error: null };
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      // Se houver erro, delete localmente
      localProducts = localProducts.filter(p => p.id !== id);
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro em deleteProductFromDB:', error);
    // Se houver exceção, delete localmente
    localProducts = localProducts.filter(p => p.id !== id);
    return { error: null };
  }
};

// Check if products exist and count them
export const countProducts = async (): Promise<{count: number | null, error: any}> => {
  try {
    // Se o Supabase não está configurado, conte localmente
    if (!supabaseConfigured) {
      if (localProducts.length === 0) {
        localProducts = generateLocalProducts();
      }
      return { count: localProducts.length, error: null };
    }
    
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      // Se houver erro, conte localmente
      if (localProducts.length === 0) {
        localProducts = generateLocalProducts();
      }
      return { count: localProducts.length, error: null };
    }
    
    return { count, error };
  } catch (error) {
    console.error('Erro em countProducts:', error);
    // Se houver exceção, conte localmente
    if (localProducts.length === 0) {
      localProducts = generateLocalProducts();
    }
    return { count: localProducts.length, error: null };
  }
};

// Create sample products
export const createSampleProducts = async (): Promise<{error: any}> => {
  try {
    const sampleProducts = Array(30).fill(null).map((_, index) => ({
      id: index + 1,
      name: `Produto ${index + 1}`,
      price: Math.floor(Math.random() * 150) + 50,
      image: `https://picsum.photos/seed/${index + 1}/300/300`,
      category: ["clothes", "shoes", "accessories"][Math.floor(Math.random() * 3)]
    }));

    // Se o Supabase não está configurado, use dados locais
    if (!supabaseConfigured) {
      localProducts = sampleProducts;
      return { error: null };
    }
    
    const { error } = await supabase.from('products').insert(sampleProducts);
    
    if (error) {
      // Se houver erro, use dados locais
      localProducts = sampleProducts;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro em createSampleProducts:', error);
    // Se houver exceção, use dados locais
    localProducts = generateLocalProducts();
    return { error: null };
  }
};
