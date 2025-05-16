
import { z } from "zod";
import { registerFormSchema } from "@/features/auth/utils/formValidation";

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const doesPasswordMeetRequirements = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return minLength && hasUppercase && hasLowercase && hasNumber;
};

export const formatPasswordRequirements = (password: string) => {
  return [
    { text: "Pelo menos 8 caracteres", met: password.length >= 8 },
    { text: "Pelo menos uma letra maiúscula", met: /[A-Z]/.test(password) },
    { text: "Pelo menos uma letra minúscula", met: /[a-z]/.test(password) },
    { text: "Pelo menos um número", met: /[0-9]/.test(password) },
  ];
};
