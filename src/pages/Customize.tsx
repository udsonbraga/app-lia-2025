
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const colorThemes = [
  { name: "Padrão", primary: "bg-safelady", secondary: "bg-safelady-light", value: "safelady" },
  { name: "Roxo", primary: "bg-purple-500", secondary: "bg-purple-100", value: "purple" },
  { name: "Azul", primary: "bg-blue-500", secondary: "bg-blue-100", value: "blue" },
  { name: "Verde", primary: "bg-green-500", secondary: "bg-green-100", value: "green" },
];

const Customize = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem("themeIndex");
    return savedTheme ? parseInt(savedTheme) : 0;
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "normal";
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
    } else if (theme.value === 'purple') {
      document.body.style.background = 'linear-gradient(to bottom, rgb(139, 92, 246), #ffffff)';
    } else if (theme.value === 'blue') {
      document.body.style.background = 'linear-gradient(to bottom, rgb(59, 130, 246), #ffffff)';
    } else if (theme.value === 'green') {
      document.body.style.background = 'linear-gradient(to bottom, rgb(34, 197, 94), #ffffff)';
    }
    
    localStorage.setItem("themeIndex", index.toString());
  };

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    
    // Remover todas as classes de tamanho de fonte
    root.classList.remove("text-small", "text-normal", "text-large");
    
    // Adicionar nova classe de tamanho
    root.classList.add(`text-${size}`);
    
    localStorage.setItem("fontSize", size);
  };

  const handleThemeChange = (index: number) => {
    setSelectedTheme(index);
    applyTheme(index);
    
    toast({
      title: "Tema atualizado",
      description: `O tema ${colorThemes[index].name} foi aplicado com sucesso.`,
    });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    applyFontSize(size);
    
    toast({
      title: "Tamanho da fonte atualizado",
      description: "A nova configuração foi aplicada com sucesso.",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram salvas com sucesso.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <DrawerMenu />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Personalizar</h1>
        
        <div className="space-y-8 max-w-md mx-auto">
          {/* Temas de Cores */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tema de Cores</h2>
            <div className="grid grid-cols-2 gap-4">
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
                    <span className="text-sm font-medium">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho da Fonte */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tamanho da Fonte</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={fontSize === "small" ? "default" : "outline"}
                onClick={() => handleFontSizeChange("small")}
              >
                Pequena
              </Button>
              <Button
                variant={fontSize === "normal" ? "default" : "outline"}
                onClick={() => handleFontSizeChange("normal")}
              >
                Normal
              </Button>
              <Button
                variant={fontSize === "large" ? "default" : "outline"}
                onClick={() => handleFontSizeChange("large")}
              >
                Grande
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSaveChanges}
            className="w-full"
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Customize;
