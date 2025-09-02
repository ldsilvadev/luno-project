import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type TRequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;
