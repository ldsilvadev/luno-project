"use client";

import { useModal } from "@/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const taskFormSchema = z.object({
  name: z.string().min(3, "Você deve preencher o nome da tarefa"),
  description: z.string().min(3, "Informe uma descrição para a tarefa"),
  status: z.nativeEnum(TaskStatus).optional(),
});

type TaskFormSchema = z.infer<typeof taskFormSchema>;

export function useTaskForm(
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    status?: TaskStatus;
  },
  projectId?: string,
  onSuccess?: () => void
) {
  const { closeModal } = useModal();
  const router = useRouter();
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormSchema>({
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      status: initialValues?.status || "todo",
    },
    resolver: zodResolver(taskFormSchema),
  });

  async function handleCreateTask(data: TaskFormSchema) {
    try {
      if (data.description === "<p><br></p>") {
        data.description = "";
        setErrorDescription("Informe uma descrição para a tarefa");
        return;
      } else {
        setErrorDescription(null);
      }

      const payload = {
        name: data.name,
        description: data.description,
        status: data.status,
      };

      if (initialValues?.id) {
        const res = await fetch(`/api/tasks/${initialValues.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success("Tarefa editada com sucesso!");
          onSuccess?.();
          closeModal();
        } else {
          const error = await res.json();

          if (res.status === 401) {
            toast.error("Sessão expirada. Faça login novamente.");
            router.push("/login");
          } else if (res.status === 400 && error.errors) {
            toast.error("Dados inválidos. Verifique os campos obrigatórios.");
          } else {
            toast.error(error.message || "Erro ao criar tarefa");
          }
        }
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: projectId, ...payload }),
        });

        if (res.ok) {
          toast.success("Tarefa criada com sucesso!");
          onSuccess?.();
          closeModal();
        } else {
          const error = await res.json();

          if (res.status === 401) {
            toast.error("Sessão expirada. Faça login novamente.");
            router.push("/login");
          } else if (res.status === 400 && error.errors) {
            toast.error("Dados inválidos. Verifique os campos obrigatórios.");
          } else {
            toast.error(error.message || "Erro ao criar projeto");
          }
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão. Tente novamente.");
    }
  }

  return {
    handleCreateTask,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    errorDescription,
  };
}
