
import { Button } from "@/components/ui/button";
import { RegisterHeader } from "./RegisterHeader";
import { FormField } from "./FormField";
import { TermsCheckbox } from "./TermsCheckbox";
import { formatPhone } from "@/features/auth/utils/formValidation";
import { useRegisterForm } from "@/features/auth/utils/registerFormUtils";

export function RegisterForm() {
  const { 
    formData, 
    setFormData, 
    errors, 
    isLoading, 
    acceptedTerms, 
    setAcceptedTerms,
    handleSubmit 
  } = useRegisterForm();

  return (
    <div className="max-w-md mx-auto">
      <RegisterHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Nome Completo"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Digite seu nome completo"
          error={errors.name}
        />

        <FormField
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="seu@email.com"
          error={errors.email}
        />

        <FormField
          label="Telefone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
          placeholder="(00) 00000-0000"
          error={errors.phone}
        />

        <FormField
          label="Senha"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          error={errors.password}
        />

        <TermsCheckbox 
          acceptedTerms={acceptedTerms}
          onCheckedChange={setAcceptedTerms}
        />

        <Button
          type="submit"
          disabled={isLoading || !acceptedTerms}
          className="w-full py-3 px-4 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Cadastrando..." : "Criar Conta"}
        </Button>
      </form>
    </div>
  );
}
