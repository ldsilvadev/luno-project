import { Input } from "../ui/input";
import { RichText } from "../ui/rich-text";
import { Button } from "../ui/button";
import { useTaskForm } from "@/hooks";
import { TaskStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { Edit, Edit2, Eye } from "lucide-react";

type FormProps = {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    status?: TaskStatus;
  };
  projectId: string;
  onSuccess?: () => void;
  mode?: 'create' | 'edit' | 'view';
};

export function TaskForm({ initialValues, onSuccess, projectId, mode = 'create' }: FormProps) {
  const [currentMode, setCurrentMode] = useState<'create' | 'edit' | 'view'>(mode);
  
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

  const toggleMode = () => {
    if (currentMode === 'view') {
      setCurrentMode('edit');
    } else if (currentMode === 'edit') {
      setCurrentMode('view');
    }
  };

  const canToggleMode = initialValues?.id && (currentMode === 'view' || currentMode === 'edit');

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'A Fazer';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  if (currentMode === 'view') {
    return (
      <div className="w-full flex flex-col gap-4">
        {canToggleMode && (
          <div className="flex justify-between items-center mb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleMode}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <label className="font-medium text-sm text-gray-700">Nome da Tarefa</label>
              <p className="text-[16px] text-foreground bg-white p-3 rounded-md border">
                {initialValues?.name || 'Sem nome'}
              </p>
            </div>
            
            <div className="w-full flex flex-col gap-2">
              <label className="font-medium text-sm text-gray-700">Descrição da Tarefa</label>
              <div className="text-[16px] text-foreground bg-white p-3 rounded-md border min-h-[100px] prose prose-sm max-w-none">
                {initialValues?.description ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: initialValues.description }} 
                    className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-600 [&_a]:decoration-1 [&_a]:underline-offset-2 [&_a:hover]:text-blue-800 [&_a:hover]:decoration-blue-800 [&_a:hover]:decoration-2 [&_a]:transition-all [&_a]:duration-200 [&_a]:cursor-pointer"
                  />
                ) : (
                  <span className="text-gray-400 italic">Sem descrição</span>
                )}
              </div>
            </div>
            
            {initialValues?.status && (
              <div className="w-full flex flex-col gap-2">
                <label className="font-medium text-sm text-gray-700">Status da Tarefa</label>
                <div className="bg-white p-3 rounded-md border">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    initialValues.status === 'completed' ? 'bg-green-100 text-green-800' :
                    initialValues.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusLabel(initialValues.status)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {canToggleMode && (
        <div className="flex justify-between items-center mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </Button>
        </div>
      )}
      
      <form
        onSubmit={handleSubmit(handleCreateTask)}
        className="w-full flex flex-col gap-4 bg-white p-4 rounded-lg border border-gray-200"
      >
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm text-gray-700">Nome da Tarefa</label>
          <Input
            placeholder="Informe o nome da tarefa"
            {...register("name")}
            error={errors.name?.message}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <RichText
            label="Descrição da Tarefa"
            placeholder="Digite algo..."
            register={register("description")}
            defaultValue={initialValues?.description || ""}
          />
          {errorDescription && (
            <span className="text-red-500 text-sm">
              Informe uma descrição para a tarefa
            </span>
          )}
          <span className="text-red-500 text-sm">{errors.description?.message}</span>
        </div>
        
        {(initialValues?.id || currentMode === 'edit') && (
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-700">Status da Tarefa</label>
            <Select
               value={currentStatus}
               onValueChange={(value) => {
                 setValue("status", value as TaskStatus);
               }}
             >
              <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500">
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
        
        <div className="flex gap-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1 transition-all duration-200 hover:shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
          {canToggleMode && (
            <Button
              type="button"
              variant="outline"
              onClick={toggleMode}
              className="px-6 transition-all duration-200 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
