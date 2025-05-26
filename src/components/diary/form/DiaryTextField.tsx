
import { Textarea } from "@/components/ui/textarea";

interface DiaryTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DiaryTextField = ({ value, onChange, error }: DiaryTextFieldProps) => {
  return (
    <div>
      <label htmlFor="diary-text" className="block text-sm font-medium text-gray-700 flex items-center">
        Descreva o Ocorrido
        <span className="text-red-500 ml-1">*</span>
      </label>
      <Textarea
        id="diary-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva seus pensamentos aqui..."
        className={`w-full h-48 p-4 mt-1 rounded-lg border ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-red-500"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default DiaryTextField;
