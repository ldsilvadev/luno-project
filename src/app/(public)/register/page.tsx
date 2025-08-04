"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useCreateUser } from "@/hooks";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { errors, handleCreateUser, handleSubmit, isSubmitting, register } =
    useCreateUser();

  return (
    <main className="w-full h-screen flex justify-center bg-background">
      <section className="w-md h-auto flex items-center flex-col gap-6 py-10">
        <Image src="/logo.svg" alt="logo" width={130} height={130} />
        <div className="w-full flex flex-col items-center justify-center">
          <span className="text-2xl text-foreground font-semibold">
            Criar sua conta
          </span>
          <span className=" text-gray-300 font-semibold">
            Crie e gerencie seus projetos de forma rápida
          </span>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateUser)}
          className="w-full flex flex-col gap-2 px-4"
        >
          <div className="flex flex-col gap-1">
            <label>Usuário</label>
            <Input
              placeholder="Seu usuário"
              {...register("user_name")}
              error={errors.user_name?.message}
            />
          </div>
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
              type="password"
              placeholder="******"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <Button type="submit" variant={"default"} className="mt-2">
            {isSubmitting ? "Criando..." : "Criar sua conta"}
          </Button>
        </form>
        <span className="text-gray-300 text-sm">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-foreground font-semibold">
            Faça login
          </Link>
        </span>
      </section>
    </main>
  );
}
