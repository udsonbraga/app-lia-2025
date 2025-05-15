
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}

export function FormField({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  error 
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
        placeholder={placeholder}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

// Also add React Hook Form compatible version
interface FormFieldRHFProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: any;
  error?: any;
  disabled?: boolean;
}

export function FormFieldRHF({ 
  name,
  label, 
  type = "text", 
  placeholder = "", 
  register, 
  error,
  disabled = false
}: FormFieldRHFProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Input
        id={name}
        type={type}
        disabled={disabled}
        {...register(name)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
        placeholder={placeholder}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}
