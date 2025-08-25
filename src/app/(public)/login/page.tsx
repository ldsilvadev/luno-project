"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/hooks/useLogin";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { handleLogin, register, handleSubmit, errors, isSubmitting } =
    useLogin();

  return (
    <main className="w-full h-screen flex justify-center">
      <section className="w-md h-auto flex items-center flex-col gap-6 py-10">
        <Image src="/logo.svg" alt="logo" width={130} height={130} />
        <div className="w-full flex flex-col items-center justify-center">
          <span className="text-2xl text-foreground font-semibold">
            Entrar na sua conta
          </span>
          <span className="text-foreground font-light">
            Bem vindo! Preencha suas credênciais
          </span>
        </div>
        <form
          className="w-full flex flex-col gap-2 px-4"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="flex flex-col gap-1">
            <label>E-mail</label>
            <Input
              placeholder="email@email.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Senha</label>
            <PasswordInput
              placeholder="******"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <div className="w-full flex items-center justify-between">
            <div>
              <Checkbox />
              <span className="ml-2">Lembrar-me</span>
            </div>
            <span className="text-foreground">Esqueceu sua senha?</span>
          </div>
          <Button
            type="submit"
            variant={"default"}
            className="mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <span className="text-foreground font-light">
          Não possui uma conta?{" "}
          <Link href="/register" className="text-foreground font-semibold">
            Cadastrar-se
          </Link>
        </span>
      </section>
    </main>
  );
}
