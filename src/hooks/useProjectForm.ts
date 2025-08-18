import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import z from "zod";
import { useModal } from "@/modules";

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

  const toDateInput = (value?: string | Date) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  };

  const {
    register,
    handleSubmit,
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

  async function handleCreateProject(data: ProjectFormValues) {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };

      if (initialValues?.id) {
        const res = await fetch(`/api/projects/${initialValues.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success("Projeto editado com sucesso!");
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
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success("Projeto criado com sucesso!");
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
    handleCreateProject,
    register,
    handleSubmit,
    errors,
    isSubmitting,
  };
}
