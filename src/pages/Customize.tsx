
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const colorThemes = [
  { name: "Padrão", primary: "bg-rose-500", secondary: "bg-rose-100" },
  { name: "Roxo", primary: "bg-purple-500", secondary: "bg-purple-100" },
  { name: "Azul", primary: "bg-blue-500", secondary: "bg-blue-100" },
  { name: "Verde", primary: "bg-green-500", secondary: "bg-green-100" },
];

const Customize = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [fontSize, setFontSize] = useState("normal");

  const handleThemeChange = (index: number) => {
    setSelectedTheme(index);
    toast({
      title: "Tema atualizado",
      description: `O tema ${colorThemes[index].name} foi aplicado com sucesso.`,
    });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    toast({
      title: "Tamanho da fonte atualizado",
      description: "A nova configuração foi aplicada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                    selectedTheme === index ? "border-blue-500" : "border-transparent"
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
            onClick={() => navigate("/")}
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
