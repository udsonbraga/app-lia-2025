
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DisguisePasswordPromptProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function DisguisePasswordPrompt({
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Modo Disfarce</h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Você está prestes a ativar o modo disfarce. Este modo transformará o aplicativo em uma loja de roupas para proteger sua privacidade.
          </p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
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
