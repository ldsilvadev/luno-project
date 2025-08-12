import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import z from "zod";


const projectFormSchema = z.object({
  name: z.string().min(3, "Você deve preencher o nome do projeto"),
  description: z.string().min(3, "Informe uma descrição para o projeto"),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function useProjectForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    },
    resolver: zodResolver(projectFormSchema),
  });

  async function handleCreateProject(data: ProjectFormValues) {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
        end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Projeto criado com sucesso!");
        reset();
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
