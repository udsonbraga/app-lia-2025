
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Type } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const colorThemes = [
  { name: "Rosa Claro", primary: "bg-safelady", secondary: "bg-safelady-light", value: "safelady" },
  { name: "Rosa Médio", primary: "bg-rose-500", secondary: "bg-rose-100", value: "rose" },
  { name: "Rosa Escuro", primary: "bg-pink-600", secondary: "bg-pink-100", value: "pink" },
];

const Customize = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem("themeIndex");
    return savedTheme ? parseInt(savedTheme) : 0;
  });
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize") || "100");
  });

  // Aplicar tema e tamanho da fonte ao carregar o componente
  useEffect(() => {
    applyTheme(selectedTheme);
    applyFontSize(fontSize);
  }, [selectedTheme, fontSize]);

  const applyTheme = (index: number) => {
    const theme = colorThemes[index];
    const root = document.documentElement;
    
    // Remover todas as classes de tema anteriores
    colorThemes.forEach(t => {
      root.classList.remove(`theme-${t.value}`);
    });
    
    // Adicionar nova classe de tema
    root.classList.add(`theme-${theme.value}`);
    
    // Atualizar variáveis CSS
    root.style.setProperty('--primary-color', `var(--${theme.value}-500)`);
    root.style.setProperty('--primary-light', `var(--${theme.value}-100)`);
    
    // Atualizar a cor de fundo do corpo do documento
    if (theme.value === 'safelady') {
      document.body.style.background = 'linear-gradient(to bottom, #FF84C6, #ffffff)';
    } else if (theme.value === 'rose') {
      document.body.style.background = 'linear-gradient(to bottom, rgb(244, 63, 94), #ffffff)';
    } else if (theme.value === 'pink') {
      document.body.style.background = 'linear-gradient(to bottom, rgb(219, 39, 119), #ffffff)';
    }
    
    localStorage.setItem("themeIndex", index.toString());
  };
  
  const applyFontSize = (size: number) => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-multiplier', `${size}%`);
    localStorage.setItem("fontSize", size.toString());
  };

  const handleThemeChange = (index: number) => {
    setSelectedTheme(index);
    applyTheme(index);
    
    toast({
      title: "Tema atualizado",
      description: `O tema ${colorThemes[index].name} foi aplicado com sucesso.`,
    });
  };
  
  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    applyFontSize(newSize);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram salvas com sucesso.",
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
          <h1 className="text-2xl font-bold">Personalizar</h1>
        </div>
        
        <div className="space-y-8 max-w-md mx-auto">
          {/* Temas de Cores */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tema de Cores</h2>
            <div className="grid grid-cols-3 gap-4">
              {colorThemes.map((theme, index) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(index)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === index ? "border-safelady" : "border-transparent"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-full h-8 rounded ${theme.primary}`} />
                    <div className={`w-full h-4 rounded ${theme.secondary}`} />
                    <span className="text-xs font-medium">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tamanho da Fonte */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Type className="h-5 w-5 text-safelady" />
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

export default Customize;
