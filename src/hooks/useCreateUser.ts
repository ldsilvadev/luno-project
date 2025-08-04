import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type UserValues = {
  user_name: string;
  email: string;
  password: string;
};

export function useCreateUser() {
  const route = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserValues>({
    defaultValues: {
      user_name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(
      z.object({
        user_name: z.string().min(3, "Usuário é obrigatório"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
      })
    ),
  });

  async function handleCreateUser(data: UserValues) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Usuário criado com sucesso!");
      route.push("/login");
    } else {
      const error = await res.json();
      toast.error(error.message);
    }
  }

  return { handleCreateUser, register, handleSubmit, errors, isSubmitting };
}
