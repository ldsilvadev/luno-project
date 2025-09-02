"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useResetPassword } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function ResetPasswordContent() {
  const { handleResetPassword, register, handleSubmit, errors, isSubmitting, token } =
    useResetPassword();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    // Validação básica do token (você pode adicionar mais validações se necessário)
    if (token.length < 10) {
      setIsValidToken(false);
      return;
    }

    setIsValidToken(true);
  }, [token]);

  if (isValidToken === null) {
    return (
      <main className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-2 text-foreground">Validando token...</p>
        </div>
      </main>
    );
  }

  if (!isValidToken) {
    return (
      <main className="w-full h-screen flex justify-center">
        <section className="w-md h-auto flex items-center flex-col gap-6 py-10">
          <Image src="/logo.svg" alt="logo" width={130} height={130} />
          <div className="w-full flex flex-col items-center justify-center text-center">
            <span className="text-2xl text-foreground font-semibold mb-2">
              Token Inválido
            </span>
            <span className="text-foreground font-light mb-4">
              O link de redefinição de senha é inválido ou expirou.
            </span>
            <Link href="/login">
              <Button variant="default">
                Voltar ao Login
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full h-screen flex justify-center">
      <section className="w-md h-auto flex items-center flex-col gap-6 py-10">
        <Image src="/logo.svg" alt="logo" width={130} height={130} />
        <div className="w-full flex flex-col items-center justify-center">
          <span className="text-2xl text-foreground font-semibold">
            Redefinir Senha
          </span>
          <span className="text-foreground font-light">
            Digite sua nova senha abaixo
          </span>
        </div>
        <form
          className="w-full flex flex-col gap-4 px-4"
          onSubmit={handleSubmit(handleResetPassword)}
        >
          <div className="flex flex-col gap-1">
            <label>Nova Senha</label>
            <PasswordInput
              placeholder="Digite sua nova senha"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Confirmar Senha</label>
            <PasswordInput
              placeholder="Confirme sua nova senha"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>
        <span className="text-foreground font-light">
          Lembrou da sua senha?{" "}
          <Link href="/login" className="text-foreground font-semibold">
            Fazer Login
          </Link>
        </span>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-2 text-foreground">Carregando...</p>
        </div>
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}