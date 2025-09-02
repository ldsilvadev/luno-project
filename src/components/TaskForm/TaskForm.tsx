import { Input } from "../ui/input";
import { RichText } from "../ui/rich-text";
import { Button } from "../ui/button";
import { useTaskForm } from "@/hooks";
import { TaskStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type FormProps = {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    status?: TaskStatus;
  };
  projectId: string;
  onSuccess?: () => void;
};

export function TaskForm({ initialValues, onSuccess, projectId }: FormProps) {
  const {
    errors,
    handleSubmit,
    isSubmitting,
    handleCreateTask,
    register,
    setValue,
    watch,
    errorDescription,
  } = useTaskForm(initialValues, projectId, onSuccess);

  const currentStatus = watch("status");

  return (
    <form
      onSubmit={handleSubmit(handleCreateTask)}
      className="w-full flex flex-col gap-2"
    >
      <div className="w-full flex flex-col gap-1">
        <label>Nome da Tarefa</label>
        <Input
          placeholder="Informe o nome da tarefa"
          {...register("name")}
          error={errors.name?.message}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <RichText
          label="Descrição da Tarefa"
          placeholder="Digite algo..."
          register={register("description")}
          defaultValue={initialValues?.description || ""}
        />
        {errorDescription && (
          <span className="text-red-400">
            Informe uma descrição para a tarefa
          </span>
        )}
        <span className="text-red-400">{errors.description?.message}</span>
      </div>
      {initialValues?.id && (
        <div className="w-full flex flex-col gap-1">
          <label>Status da Tarefa</label>
          <Select
             value={currentStatus}
             onValueChange={(value) => {
               setValue("status", value as TaskStatus);
             }}
           >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">A Fazer</SelectItem>
               <SelectItem value="in_progress">Em Andamento</SelectItem>
               <SelectItem value="completed">Concluído</SelectItem>
             </SelectContent>
          </Select>
        </div>
      )}
      <Button type="submit" className="mt-1">
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
