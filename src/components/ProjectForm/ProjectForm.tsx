"use client";

import { useProjectForm } from "@/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function ProjectForm() {
  const { errors, handleSubmit, isSubmitting, handleCreateProject, register } =
    useProjectForm();

  return (
    <form
      onSubmit={handleSubmit(handleCreateProject)}
      className="w-full flex flex-col gap-2"
    >
      <div className="w-full flex flex-col gap-1">
        <label>Nome do Projeto</label>
        <Input
          placeholder="Projeto 0"
          {...register("name")}
          error={errors.name?.message}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <label>Descrição do Projeto</label>
        <Textarea
          placeholder="Esse projeto foi criado para..."
          {...register("description")}
        />
      </div>
      <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2">
        <div className="w-full flex flex-col gap-1">
          <label>Data Inicio do Projeto</label>
          <input type="date" {...register("start_date")} />
        </div>
        <div className="w-full flex flex-col gap-1">
          <label>Data Fim do Projeto</label>
          <input type="date" {...register("end_date")} />
        </div>
      </div>
      <Button type="submit" className="mt-1">
        {isSubmitting ? "Criando..." : "Criar Projeto"}
      </Button>
    </form>
  );
}
