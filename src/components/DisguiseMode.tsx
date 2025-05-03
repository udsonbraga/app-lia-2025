
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDisguiseMode } from '@/hooks/useDisguiseMode';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function DisguiseMode() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { exitDisguiseMode } = useDisguiseMode();
  const productsPerPage = 10;

  useEffect(() => {
    // Generate dummy product data
    const generateProducts = () => {
      const categories = ['Vestuário', 'Calçados', 'Acessórios', 'Beleza', 'Bolsas'];
      const items: Product[] = [];
      
      for (let i = 1; i <= 100; i++) {
        const categoryIndex = Math.floor(Math.random() * categories.length);
        const price = parseFloat((Math.random() * 300 + 50).toFixed(2));
        
        items.push({
          id: i,
          name: `Produto ${i} - ${categories[categoryIndex]}`,
          price: price,
          image: `https://source.unsplash.com/100x100/?fashion,women,${categories[categoryIndex].toLowerCase()}`,
          category: categories[categoryIndex]
        });
      }
      
      return items;
    };
    
    // Simulate loading from API
    setTimeout(() => {
      setProducts(generateProducts());
      setLoading(false);
    }, 800);
  }, []);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with exit button */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50 px-4 flex items-center justify-between">
        <button 
          onClick={exitDisguiseMode}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-center">Loja Feminina</h1>
        <div className="w-10" />
      </div>
      
      {/* Product Grid */}
      <div className="container mx-auto pt-20 pb-24 px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Produtos em destaque</h2>
          <p className="text-gray-600">Descubra nossa nova coleção</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-md animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="h-32 overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://source.unsplash.com/100x100/?fashion";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="text-sm font-medium mb-1 truncate">{product.name}</h3>
                    <p className="text-sm font-bold">R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    
                    // Show first page, current page, last page, and 1 page before and after current
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      pageNumber === currentPage ||
                      pageNumber === currentPage - 1 ||
                      pageNumber === currentPage + 1
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            onClick={() => paginate(pageNumber)}
                            isActive={pageNumber === currentPage}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
