"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks";
import { GetProject } from "@/types";
import { useParams} from "next/navigation";
import { Kanban, useModal } from "@/modules";
import { ProjectForm, TaskForm } from "@/components";
import { AppWindow, Play, X, Plus, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Project() {
  const params = useParams();
  const { openModal } = useModal();
  const { id } = params;

  const [refreshTasksFn, setRefreshTasksFn] = useState<() => void>(
    () => () => {}
  );

  const { data, refetch } = useGet<GetProject>(`/api/projects/${id}`);

  const formatDate = (date?: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const localDateOnly = new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate()
    );
    return format(localDateOnly, "dd 'de' MMM 'de' yyyy", { locale: ptBR });
  };

  const handleEdit = () => {
    if (!data) return;
    openModal({
      title: "Editar projeto",
      description: "Faça alterações em seu projeto",
      content: <ProjectForm initialValues={data} onSuccess={refetch} />,
    });
  };

  const handleCreateTask = () => {
    openModal({
      title: "Criar tarefa",
      description: "Crie uma tarefa para seu projeto",
      content: <TaskForm projectId={id as string} onSuccess={refreshTasksFn} />,
    });
  };

  const handleCreateTaskWithAI = () => {
    console.log("Criar tarefa com IA");
  };

  return (
    <section className="w-full">
      <header className="w-full bg-background bg-gradient-to-r from-foreground/25 to-foreground/15 border-b border-indigo-100">
        <div className="px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-foreground/25 to-background rounded-xl shadow-lg">
                    <AppWindow size={24} className="text-background" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground/70 to-foreground/30 bg-clip-text text-transparent">
                      {data?.name || "Projeto"}
                    </h1>
                    <div className="flex gap-5 items-center mt-1 flex-wrap text-foreground/40">
                      <div className="flex gap-1 items-center text-xs">
                        <Play className="w-4 h-4" />
                        <span>{formatDate(data?.start_date)}</span>
                      </div>
                      <div className="flex gap-1 items-center text-xs">
                        <X className="w-4 h-4" />
                        <span>{formatDate(data?.end_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-foreground/60 to-foreground/30 hover:from-foreground/60 hover:to-foreground/40 text-background shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={18} className="mr-1" />
                Nova Tarefa
              </Button>
              <Button
                onClick={handleCreateTaskWithAI}
                variant="outline"
                className="border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/10 transition-all duration-300 group"
              >
                <Sparkles size={18} className="mr-1" />
                Com IA
              </Button>
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/20 transition-all duration-300"
              >
                Editar Projeto
              </Button>
            </div>
          </div>

          <div className="flex lg:hidden gap-2 mt-4">
            <Button
              onClick={handleCreateTask}
              className="flex-1 bg-gradient-to-r from-foreground/60 to-foreground/30 hover:from-foreground/60 hover:to-foreground/40 text-background shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={18} className="mr-1" />
              Nova Tarefa
            </Button>
            <Button
              onClick={handleCreateTaskWithAI}
              variant="outline"
              className="flex-1 border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/10 transition-all duration-300"
            >
              <Sparkles size={18} className="mr-1" />
              Com IA
            </Button>
          </div>

          <div className="flex lg:hidden gap-2 mt-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex-1 border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/20 transition-all duration-300"
            >
              Editar Projeto
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full flex items-start mt-10 px-6 md:px-10">
        <Kanban
          projectId={id as string}
          refetch={refetch}
          provideRefetch={(fn) => setRefreshTasksFn(() => fn)}
        />
      </div>
    </section>
  );
}
