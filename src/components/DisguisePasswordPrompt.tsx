
import { Button } from "@/components/ui/button";

interface DisguisePasswordPromptProps {
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function DisguisePasswordPrompt({
  password,
  onPasswordChange,
  onSubmit,
  onCancel
}: DisguisePasswordPromptProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Definir Senha do Modo Disfarce</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
          placeholder="Digite uma senha"
          required
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">Confirmar</Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
