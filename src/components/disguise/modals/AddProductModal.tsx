
import React from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editedName: string;
  setEditedName: (name: string) => void;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
  editedImage: string;
  setEditedImage: (image: string) => void;
  editedCategory: string;
  setEditedCategory: (category: string) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export function AddProductModal({
  open,
  onOpenChange,
  editedName,
  setEditedName,
  editedPrice,
  setEditedPrice,
  editedImage,
  setEditedImage,
  editedCategory,
  setEditedCategory,
  onAdd,
  isLoading
}: AddProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid w-full gap-1.5">
            <label htmlFor="add-name">Nome do produto</label>
            <Input 
              id="add-name" 
              value={editedName} 
              onChange={e => setEditedName(e.target.value)} 
              placeholder="Nome do produto" 
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <label htmlFor="add-price">Preço (R$)</label>
            <Input 
              id="add-price" 
              value={editedPrice} 
              onChange={e => setEditedPrice(e.target.value)} 
              placeholder="0.00" 
              type="number" 
              min="0" 
              step="0.01" 
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <label htmlFor="add-image">URL da Imagem</label>
            <Input 
              id="add-image" 
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
            <label htmlFor="add-category">Categoria</label>
            <select 
              id="add-category"
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={onAdd} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando
              </>
            ) : (
              "Adicionar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
