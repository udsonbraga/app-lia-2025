
import { useDisguiseModeToggle } from './useDisguiseModeToggle';
import { useProductOperations } from './useProductOperations';

export const useDisguiseMode = () => {
  const { 
    isDisguiseActive, 
    toggleDisguiseMode, 
    exitDisguiseMode 
  } = useDisguiseModeToggle();
  
  const {
    isLoading,
    initializeProducts,
    getProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    useLocalStorage,
    toggleStorageMode
  } = useProductOperations();

  return {
    // Mode management
    isDisguiseActive,
    toggleDisguiseMode,
    exitDisguiseMode,
    
    // Product operations
    isLoading,
    initializeProducts,
    getProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    
    // Storage mode
    useLocalStorage,
    toggleStorageMode
  };
};
