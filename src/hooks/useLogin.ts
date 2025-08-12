import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { loginSchema, TLoginSchema } from "@/features";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export function useLogin() {
  const route = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: TLoginSchema) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success("Login realizado com sucesso!");
        login(responseData.token, responseData.user);
        route.push("/dashboard");
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return { handleLogin, register, handleSubmit, errors, isSubmitting };
}
