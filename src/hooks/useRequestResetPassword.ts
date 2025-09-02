"use client";

import { useModal } from "@/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const requestResetPasswordSchema = z.object({
  emailReset: z.string().email("E-mail inválido"),
});

type RequestResetPasswordForm = z.infer<typeof requestResetPasswordSchema>;

export function useRequestResetPassword() {
  const { closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestResetPasswordForm>({
    defaultValues: {
      emailReset: "",
    },
    resolver: zodResolver(requestResetPasswordSchema),
  });

  async function handleRequestResetPassword(data: RequestResetPasswordForm) {
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        body: JSON.stringify({
          email: data.emailReset,
        }),
      });

      if (res.ok) {
        toast.success("Email enviado com sucesso!");
        closeModal();
      } else {
        toast.error("Erro ao enviar email, tente novamente!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleRequestResetPassword,
  };
}
