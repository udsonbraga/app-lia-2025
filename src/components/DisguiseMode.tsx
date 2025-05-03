import React, { useState, useEffect } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function DisguiseMode() {
  const navigate = useNavigate();
  const { exitDisguiseMode, getProducts, updateProduct } = useDisguiseMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  // Carregar produtos do serviço de dados
  useEffect(() => {
    setProducts(getProducts());
  }, [getProducts]);

  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);

  // Get current products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExitDisguise = () => {
    exitDisguiseMode();
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setEditedName(product.name);
    setEditedPrice(product.price.toString());
    setEditedImage(product.image);
    setEditedCategory(product.category);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentProduct) return;

    // Validate inputs
    if (!editedName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    const priceNumber = parseFloat(editedPrice);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser um número positivo.",
        variant: "destructive"
      });
      return;
    }

    if (!editedImage.trim()) {
      toast({
        title: "Erro",
        description: "A URL da imagem não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    if (!editedCategory.trim()) {
      toast({
        title: "Erro",
        description: "A categoria não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    // Update product
    const updatedProduct = { 
      ...currentProduct, 
      name: editedName, 
      price: priceNumber, 
      image: editedImage,
      category: editedCategory 
    };
    
    const updatedProducts = updateProduct(updatedProduct);
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={handleExitDisguise}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            
            <h1 className="text-xl font-semibold">Moda Feminina</h1>
            
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto pt-20 pb-4">
        <div className="flex gap-2 overflow-x-auto py-2 px-4">
          <button 
            onClick={() => setCategory("all")}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
              category === "all" 
                ? "bg-pink-500 text-white" 
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Todos
          </button>
          <button 
            onClick={() => setCategory("clothes")}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
              category === "clothes" 
                ? "bg-pink-500 text-white" 
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Roupas
          </button>
          <button 
            onClick={() => setCategory("shoes")}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
              category === "shoes" 
                ? "bg-pink-500 text-white" 
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Calçados
          </button>
          <button 
            onClick={() => setCategory("accessories")}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
              category === "accessories" 
                ? "bg-pink-500 text-white" 
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Acessórios
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <button 
                onClick={() => openEditModal(product)} 
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
                aria-label="Editar produto"
              >
                <Pencil className="h-4 w-4 text-gray-600" />
              </button>
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate">{product.name}</h3>
                <p className="text-pink-600 font-semibold mt-1">
                  R$ {product.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {product.category === "clothes" ? "Roupas" : 
                   product.category === "shoes" ? "Calçados" : "Acessórios"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    currentPage === i + 1
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid w-full gap-1.5">
              <label htmlFor="name">Nome do produto</label>
              <Input 
                id="name" 
                value={editedName} 
                onChange={e => setEditedName(e.target.value)} 
                placeholder="Nome do produto" 
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <label htmlFor="price">Preço (R$)</label>
              <Input 
                id="price" 
                value={editedPrice} 
                onChange={e => setEditedPrice(e.target.value)} 
                placeholder="0.00" 
                type="number" 
                min="0" 
                step="0.01" 
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <label htmlFor="image">URL da Imagem</label>
              <Input 
                id="image" 
                value={editedImage} 
                onChange={e => setEditedImage(e.target.value)} 
                placeholder="https://example.com/image.jpg" 
              />
              {editedImage && (
                <div className="mt-2 max-w-xs mx-auto">
                  <div className="aspect-square bg-gray-100 overflow-hidden rounded-md">
                    <img 
                      src={editedImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/300x300?text=Image+Error';
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid w-full gap-1.5">
              <label htmlFor="category">Categoria</label>
              <select 
                id="category"
                value={editedCategory}
                onChange={e => setEditedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF84C6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione uma categoria</option>
                <option value="clothes">Roupas</option>
                <option value="shoes">Calçados</option>
                <option value="accessories">Acessórios</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
