
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Type, TextCursor } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Accessibility = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize") || "100");
  });

  // Aplicar tamanho da fonte ao carregar o componente
  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const applyFontSize = (size: number) => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-multiplier', `${size}%`);
    localStorage.setItem("fontSize", size.toString());
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    applyFontSize(newSize);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de acessibilidade foram salvas com sucesso.",
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-2 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold">Acessibilidade</h1>
        </div>
        
        <div className="space-y-8 max-w-md mx-auto">
          {/* Tamanho da Fonte */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TextCursor className="h-5 w-5 text-safelady" />
              <h2 className="text-lg font-semibold">Tamanho do Texto</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Menor</span>
                  <span className="text-sm text-gray-500">Maior</span>
                </div>
                <Slider
                  value={[fontSize]}
                  min={80}
                  max={150}
                  step={5}
                  onValueChange={handleFontSizeChange}
                  className="w-full"
                />
              </div>
              
              {/* Preview do texto */}
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-1">Visualização:</h3>
                <p style={{ fontSize: `${fontSize}%` }} className="text-gray-700 transition-all">
                  Este é um exemplo de texto com o tamanho selecionado.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveChanges}
            className="w-full bg-safelady hover:bg-safelady-dark text-white"
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
