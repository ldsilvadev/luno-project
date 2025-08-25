"use client";

import { useProjectForm } from "@/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RichText } from "../ui/rich-text";

type FormProps = {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    start_date?: string | Date;
    end_date?: string | Date;
  };
  onSuccess?: () => void;
};

export function ProjectForm({ initialValues, onSuccess }: FormProps) {
  const { errors, handleSubmit, isSubmitting, handleCreateProject, register, errorDescription } =
    useProjectForm(initialValues, onSuccess);

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
        <RichText
          label="Descrição do Projeto"
          placeholder="Digite algo..."
          register={register("description")}
          defaultValue={initialValues?.description || ""}
        />
        {errorDescription && <span className="text-red-400">Informe uma descrição para o projeto</span>}
        <span className="text-red-400">{errors.description?.message}</span>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2">
        <div className="w-full flex flex-col gap-1">
          <label>Data Inicio do Projeto</label>
          <input type="date" {...register("start_date")} />
          <span className="text-red-400">{errors.start_date?.message}</span>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label>Data Fim do Projeto</label>
          <input type="date" {...register("end_date")} />
          <span className="text-red-400">{errors.end_date?.message}</span>
        </div>
      </div>
      <Button type="submit" className="mt-1">
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
