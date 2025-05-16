
import { Input } from "@/components/ui/input";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: FieldError | undefined;
  register?: UseFormRegister<any>;
  name?: string;
  disabled?: boolean;
}

export function FormField({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  error,
  register,
  name = "",
  disabled = false
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {register && name ? (
        <Input
          type={type}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          placeholder={placeholder}
          disabled={disabled}
          {...register(name)}
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {error && error.message && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}
