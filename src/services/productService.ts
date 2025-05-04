
import { supabase } from '@/lib/supabase';

// Define the Product type since we don't have a generated type for it
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Function to count products (for initialization check)
export const countProducts = async () => {
  try {
    // Since we're working with local storage for now, we'll check localStorage
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    
    return { count: products.length, error: null };
  } catch (error: any) {
    console.error('Error counting products:', error);
    return { count: 0, error: error.message };
  }
};

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    // Get products from localStorage
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    
    return { success: true, data: products };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
};

// Function to fetch products by category
export const fetchProductsByCategory = async (category: string) => {
  try {
    const { data: allProducts, error } = await fetchProducts();
    
    if (error) throw error;
    
    const filtered = allProducts.filter((product: Product) => product.category === category);
    return { success: true, data: filtered };
  } catch (error: any) {
    console.error(`Error fetching products by category ${category}:`, error);
    return { success: false, error: error.message };
  }
};

// Function to fetch a specific product
export const fetchProductById = async (id: number) => {
  try {
    const { data: allProducts, error } = await fetchProducts();
    
    if (error) throw error;
    
    const product = allProducts.find((p: Product) => p.id === id);
    
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return { success: true, data: product };
  } catch (error: any) {
    console.error(`Error fetching product ID ${id}:`, error);
    return { success: false, error: error.message };
  }
};

// Function to add a product to the database
export const addProductToDB = async (product: Omit<Product, 'id'>) => {
  try {
    // Get current products
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    
    // Generate a new ID (max ID + 1 or 1 if no products)
    const newId = products.length > 0 
      ? Math.max(...products.map((p: Product) => p.id)) + 1 
      : 1;
    
    // Add new product with generated ID
    const newProduct = { ...product, id: newId };
    products.push(newProduct);
    
    // Save updated products back to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, data: newProduct };
  } catch (error: any) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

// Function to update a product
export const updateProductInDB = async (updatedProduct: Product) => {
  try {
    // Get current products
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    
    // Find and update the product
    const index = products.findIndex((p: Product) => p.id === updatedProduct.id);
    
    if (index === -1) {
      throw new Error(`Product with ID ${updatedProduct.id} not found`);
    }
    
    products[index] = updatedProduct;
    
    // Save updated products back to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, data: updatedProduct };
  } catch (error: any) {
    console.error(`Error updating product ID ${updatedProduct.id}:`, error);
    return { success: false, error: error.message };
  }
};

// Function to delete a product
export const deleteProductFromDB = async (id: number) => {
  try {
    // Get current products
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    
    // Find the product to delete
    const index = products.findIndex((p: Product) => p.id === id);
    
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    // Remove the product
    products.splice(index, 1);
    
    // Save updated products back to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting product ID ${id}:`, error);
    return { success: false, error: error.message };
  }
};

// Function to create sample products (for initialization)
export const createSampleProducts = async () => {
  try {
    const sampleProducts = [
      {
        id: 1,
        name: "Vestido Floral",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
        category: "Vestidos"
      },
      {
        id: 2,
        name: "Bolsa de Couro",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D",
        category: "Acessórios"
      },
      {
        id: 3,
        name: "Sapato de Salto",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlnaCUyMGhlZWxzfGVufDB8fDB8fHww",
        category: "Calçados"
      },
      {
        id: 4,
        name: "Blusa Básica",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dCUyMHNoaXJ0fGVufDB8fDB8fHww",
        category: "Blusas"
      }
    ];
    
    // Save sample products to localStorage
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error creating sample products:', error);
    return { success: false, error: error.message };
  }
};
