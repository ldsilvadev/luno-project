"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  async function handleResetPassword(data: ResetPasswordForm) {
    if (!token) {
      toast.error("Token inválido ou ausente");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Senha redefinida com sucesso!");
        router.push("/login");
      } else {
        toast.error(result.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro interno do servidor");
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleResetPassword,
    token,
  };
}