"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestResetPassword } from "@/hooks";

export function ResetPasswordForm() {
  const {
    errors,
    handleRequestResetPassword,
    handleSubmit,
    isSubmitting,
    register,
  } = useRequestResetPassword();

  return (
    <form
      onSubmit={handleSubmit(handleRequestResetPassword)}
      className="flex flex-col gap-2"
    >
      <Input
        type="email"
        {...register("emailReset")}
        placeholder="Informe seu e-mail"
        error={errors.emailReset?.message}
      />
      <Button type="submit">{isSubmitting ? "Enviando..." : "Enviar"}</Button>
    </form>
  );
}
