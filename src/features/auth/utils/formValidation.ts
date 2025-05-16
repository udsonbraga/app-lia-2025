
import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string()
    .email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export const loginFormSchema = z.object({
  email: z.string()
    .email("Email inválido"),
  password: z.string()
    .min(1, "Senha é obrigatória")
});

export const passwordRecoverySchema = z.object({
  email: z.string()
    .email("Email inválido")
});
