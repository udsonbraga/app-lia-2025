
import { Button } from "@/components/ui/button";
import { RegisterFormHeader } from "./RegisterFormHeader";
import { RegisterFormFields } from "./RegisterFormFields";
import { RegisterFormTerms } from "./RegisterFormTerms";
import { useRegistration } from "../hooks/useRegistration";

export function RegisterForm() {
  const {
    formData,
    setFormData,
    errors,
    isLoading,
    acceptedTerms,
    setAcceptedTerms,
    handleSubmit
  } = useRegistration();

  return (
    <div className="max-w-md mx-auto">
      <RegisterFormHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RegisterFormFields 
          formData={formData}
          errors={errors}
          setFormData={setFormData}
        />

        <RegisterFormTerms 
          acceptedTerms={acceptedTerms}
          setAcceptedTerms={setAcceptedTerms}
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
