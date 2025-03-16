
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/features/auth/utils/formValidation";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterFormFieldsProps {
  formData: FormData;
  errors: Partial<FormData>;
  setFormData: (data: FormData) => void;
}

export function RegisterFormFields({ formData, errors, setFormData }: RegisterFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          placeholder="Digite seu nome completo"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          placeholder="(00) 00000-0000"
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>
    </>
  );
}
