
import { supabase, Product } from '@/lib/supabase';

// Get all products
export const fetchProducts = async (): Promise<{data: Product[], error: any}> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    return { data, error };
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return { data: [], error };
  }
};

// Update a product
export const updateProductInDB = async (updatedProduct: Product): Promise<{error: any}> => {
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
    
    return { error };
  } catch (error) {
    console.error('Error in updateProductInDB:', error);
    return { error };
  }
};

// Add a new product
export const addProductToDB = async (newProduct: Omit<Product, 'id'>): Promise<{error: any}> => {
  try {
    const { error } = await supabase
      .from('products')
      .insert(newProduct);
    
    return { error };
  } catch (error) {
    console.error('Error in addProductToDB:', error);
    return { error };
  }
};

// Delete a product
export const deleteProductFromDB = async (id: number): Promise<{error: any}> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    return { error };
  } catch (error) {
    console.error('Error in deleteProductFromDB:', error);
    return { error };
  }
};

// Check if products exist and count them
export const countProducts = async (): Promise<{count: number | null, error: any}> => {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    return { count, error };
  } catch (error) {
    console.error('Error in countProducts:', error);
    return { count: null, error };
  }
};

// Create sample products
export const createSampleProducts = async (): Promise<{error: any}> => {
  try {
    const sampleProducts = Array(30).fill(null).map((_, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      price: Math.floor(Math.random() * 150) + 50,
      image: `https://picsum.photos/seed/${index + 1}/300/300`,
      category: ["clothes", "shoes", "accessories"][Math.floor(Math.random() * 3)]
    }));

    const { error } = await supabase.from('products').insert(sampleProducts);
    return { error };
  } catch (error) {
    console.error('Error in createSampleProducts:', error);
    return { error };
  }
};
