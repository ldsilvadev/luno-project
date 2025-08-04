import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
