
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a interface do produto
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Estado global para os produtos (simula um banco de dados)
let globalProducts: Product[] = [];

export const useDisguiseMode = () => {
  const [isDisguiseActive, setIsDisguiseActive] = useState(false);
  const navigate = useNavigate();

  // Inicialização dos produtos se ainda não existirem
  useEffect(() => {
    if (globalProducts.length === 0) {
      // Cria produtos de exemplo apenas se ainda não existirem
      globalProducts = Array(30).fill(null).map((_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        price: Math.floor(Math.random() * 150) + 50,
        image: `https://picsum.photos/seed/${index + 1}/300/300`,
        category: ["clothes", "shoes", "accessories"][Math.floor(Math.random() * 3)]
      }));
    }
  }, []);

  useEffect(() => {
    // Check if disguise mode was active when page was closed/refreshed
    const savedMode = localStorage.getItem('disguiseMode');
    if (savedMode === 'active') {
      setIsDisguiseActive(true);
      navigate('/disguise');
    }
  }, [navigate]);

  const toggleDisguiseMode = () => {
    const newMode = !isDisguiseActive;
    setIsDisguiseActive(newMode);
    
    if (newMode) {
      localStorage.setItem('disguiseMode', 'active');
      navigate('/disguise');
    } else {
      localStorage.setItem('disguiseMode', 'inactive');
      navigate('/home');
    }
  };

  const exitDisguiseMode = () => {
    setIsDisguiseActive(false);
    localStorage.setItem('disguiseMode', 'inactive');
    navigate('/home');
  };

  // Funções para interagir com os produtos
  const getProducts = () => {
    return [...globalProducts];
  };

  const updateProduct = (updatedProduct: Product) => {
    globalProducts = globalProducts.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    );
    return getProducts();
  };

  return { 
    isDisguiseActive, 
    toggleDisguiseMode, 
    exitDisguiseMode,
    getProducts,
    updateProduct
  };
};
