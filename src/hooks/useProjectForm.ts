"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import z from "zod";
import { useModal } from "@/modules";
import { useState } from "react";

const projectFormSchema = z.object({
  name: z.string().min(3, "Você deve preencher o nome do projeto"),
  description: z.string().min(3, "Informe uma descrição para o projeto"),
  start_date: z.string().min(1, "Informe a data de início"),
  end_date: z.string().min(1, "Informe a data de término"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function useProjectForm(
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    start_date?: string | Date;
    end_date?: string | Date;
  },
  onSuccess?: () => void
) {
  const router = useRouter();
  const { closeModal } = useModal();
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  const toDateInput = (value?: string | Date) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      start_date: toDateInput(initialValues?.start_date),
      end_date: toDateInput(initialValues?.end_date),
    },
    resolver: zodResolver(projectFormSchema),
  });

  const validateDates = (data: ProjectFormValues) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (isNaN(start.getTime())) {
      setError("start_date", {
        type: "manual",
        message: "Data de início inválida",
      });
      return false;
    }

    if (isNaN(end.getTime())) {
      setError("end_date", {
        type: "manual",
        message: "Data de término inválida",
      });
      return false;
    }

    if (start > end) {
      // Mostrar toast e marcar campos com erro visual (sem mensagem)
      toast.error("A data de início deve ser anterior ou igual à data de término");
      setError("start_date", {
        type: "manual",
        message: "", // Sem mensagem para não aparecer abaixo do input
      });
      setError("end_date", {
        type: "manual",
        message: "", // Sem mensagem para não aparecer abaixo do input
      });
      return false;
    }

    return true;
  };

  const validateDescription = (description: string) => {
    if (description === "<p><br></p>" || description.trim() === "") {
      setErrorDescription("Informe uma descrição para o projeto");
      return false;
    }
    setErrorDescription(null);
    return true;
  };

  const makeApiRequest = async (url: string, method: string, payload: ProjectFormValues) => {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const successMessage = method === "PUT" ? "Projeto editado com sucesso!" : "Projeto criado com sucesso!";
      toast.success(successMessage);
      onSuccess?.();
      closeModal();
      return;
    }

    const error = await res.json();

    if (res.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      router.push("/login");
    } else if (res.status === 400 && error.errors) {
      toast.error("Dados inválidos. Verifique os campos obrigatórios.");
    } else {
      toast.error(error.message || "Erro ao processar projeto");
    }
  };

  async function handleCreateProject(data: ProjectFormValues) {
    try {
      // Validar descrição
      if (!validateDescription(data.description)) {
        return;
      }

      // Validar datas
      if (!validateDates(data)) {
        return;
      }

      const start = new Date(data.start_date);
      const end = new Date(data.end_date);

      const payload = {
        name: data.name,
        description: data.description,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
      };

      const url = initialValues?.id ? `/api/projects/${initialValues.id}` : "/api/projects";
      const method = initialValues?.id ? "PUT" : "POST";

      await makeApiRequest(url, method, payload);
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão. Tente novamente.");
    }
  }

  return {
    handleCreateProject,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    errorDescription,
    setError,
  };
}
