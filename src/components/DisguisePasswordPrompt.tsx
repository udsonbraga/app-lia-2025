
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, X } from "lucide-react";

interface DisguisePasswordPromptProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function DisguisePasswordPrompt({
  password,
  onPasswordChange,
  onSubmit,
  onCancel,
}: DisguisePasswordPromptProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Modo Disfarce</h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Defina uma senha para ativar o modo disfarce. Você precisará desta senha para voltar ao modo normal.
          </p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="disguise-password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Input
                id="disguise-password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Digite uma senha segura"
                className="w-full"
                required
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Ativar Modo Disfarce
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
