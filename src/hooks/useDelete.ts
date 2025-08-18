import toast from "react-hot-toast";

type useDeleteProps = {
  endPoint: string | null;
  onSuccess?: () => void;
};

export function useDelete({ endPoint, onSuccess }: useDeleteProps) {
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`${endPoint}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.ok) {
        toast.success("Exclusão feita com sucesso!");
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir");
    }
  }

  return { handleDelete };
}
