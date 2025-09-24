"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kibo-ui/kanban";
import type { DragStartEvent as DndDragStartEvent } from "@dnd-kit/core";
import { useDelete, useGet } from "@/hooks";
import { Trash, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/modules";
import { TaskForm } from "@/components";
import toast from "react-hot-toast";
import type { TaskStatus } from "@/features/task/task.types";
import { sanitizeHtml } from "@/lib/utils";

type ApiTask = {
  id: string;
  name: string;
  description?: string | null;
  status: TaskStatus;
  projectId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// App-wide consistent colors - Modern palette
const columns = [
  { id: "todo" as TaskStatus, name: "A Fazer", color: "#E2E8F0" },
  { id: "in_progress" as TaskStatus, name: "Em Progresso", color: "#3B82F6" },
  { id: "completed" as TaskStatus, name: "Concluídas", color: "#10B981" },
];

type KanbanProps = {
  projectId: string;
  refetch?: () => void; // refetch do projeto (mantido para compatibilidade)
  provideRefetch?: (fn: () => void) => void; // expõe o refetch das tarefas para o pai
};

export function Kanban({ projectId, provideRefetch }: KanbanProps) {
  const endpoint = projectId ? `/api/tasks/projectId/${projectId}` : null;
  const {
    data,
    isLoading,
    refetch: refetchTasks,
  } = useGet<ApiTask[]>(endpoint);
  const { openModal } = useModal();
  const { handleDelete } = useDelete({
    endPoint: "/api/tasks",
    onSuccess: refetchTasks,
  });

  useEffect(() => {
    if (provideRefetch) {
      provideRefetch(refetchTasks);
    }
  }, [provideRefetch, refetchTasks]);

  const initial = useMemo(
    () =>
      [] as Array<{
        id: string;
        name: string;
        column: TaskStatus;
        description?: string | null;
      }>,
    []
  );
  const [features, setFeatures] = useState<
    Array<{
      id: string;
      name: string;
      column: TaskStatus;
      description?: string | null;
    }>
  >(initial);

  useEffect(() => {
    if (!data) return;
    const mapped = data.map((t) => ({
      id: t.id,
      name: t.name,
      column: t.status,
      description: t.description,
    }));
    setFeatures(mapped);
  }, [data]);


  const handleEditTask = (task: {
    id: string;
    name: string;
    description?: string | null;
    column: TaskStatus;
  }) => {
    const initialValues = {
      id: task.id,
      name: task.name,
      description: task.description || "",
      status: task.column,
    };

    openModal({
      title: "Visualizar/Editar tarefa",
      description: "Você pode visualizar ou editar os dados da tarefa",
      content: (
        <TaskForm
          initialValues={initialValues}
          projectId={projectId}
          mode="view"
          onSuccess={refetchTasks}
        />
      ),
      sizeClassName:
        "!max-w-[80%] lg:!max-w-[800px]  lg2:!max-w-[800px] max-h-[95%] overflow-y-auto",
    });
  };

  const dragStartRef = useRef<{ id: string; from: TaskStatus } | null>(null);

  const changeCardStatus = useCallback(
    async (
      taskId: string,
      newStatus: TaskStatus,
      previousStatus: TaskStatus
    ) => {
      try {
        const response = await fetch(`/api/tasks/change-status/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const message = error?.message || "Erro ao mudar o status da tarefa";
          throw new Error(message);
        }
      } catch (err) {
        setFeatures((prev) =>
          prev.map((item) =>
            item.id === taskId ? { ...item, column: previousStatus } : item
          )
        );
        console.error(err);
        toast.error("Erro de conexão. Tente novamente.");
      }
    },
    [setFeatures]
  );

  const handleDragStart = useCallback(
    (event: DndDragStartEvent) => {
      const activeId = String(event.active.id);
      const card = features.find((f) => f.id === activeId);
      if (!card) return;
      dragStartRef.current = { id: activeId, from: card.column };
    },
    [features]
  );

  const handleDragEnd = useCallback(async () => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (!start) return;

    const current = features.find((f) => f.id === start.id);
    if (!current) return;

    const movedTo = current.column;
    if (movedTo === start.from) return; // apenas reordenação, sem mudança de coluna

    await changeCardStatus(start.id, movedTo, start.from);
  }, [features, changeCardStatus]);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-sm text-foreground/40">Carregando tarefas...</div>
      ) : (
        <KanbanProvider
          columns={columns}
          data={features}
          onDataChange={setFeatures}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="grid-cols-1 lg:grid-cols-3 grid-flow-row lg:grid-flow-col gap-4"
        >
          {(column) => (
            <KanbanBoard
              id={column.id}
              key={column.id}
              className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm min-h-[200px] md:min-h-[300px] lg:min-h-[500px] w-full"
            >
              <KanbanHeader>
                <div className="flex items-center gap-3 p-4 pb-2">
                  <div
                    className="h-3 w-3 rounded-full shadow-sm"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="font-semibold text-gray-700 text-sm tracking-wide">{column.name}</span>
                </div>
              </KanbanHeader>
              <KanbanCards id={column.id}>
                {(feature: (typeof features)[number]) => (
                  <KanbanCard
                    column={column.id}
                    id={feature.id}
                    key={feature.id}
                    name={feature.name}
                    className="bg-white border border-gray-200/60 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-200 mx-2 mb-3 w-auto min-w-0"
                  >
                    <div className="flex flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="m-0 font-semibold text-sm leading-snug text-gray-800 tracking-wide flex-1 min-w-0 break-words">
                          {feature.name}
                        </h4>
                        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          aria-label="Editar tarefa"
                          title="Editar"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(feature);
                          }}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          aria-label="Excluir tarefa"
                          title="Excluir"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(feature.id);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                        </div>
                      </div>
                      {feature.description && (
                        <div
                          className="m-0 text-xs text-gray-600 leading-relaxed break-words"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(feature.description || ""),
                          }}
                        />
                      )}
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
              {features.filter((f) => f.column === column.id).length === 0 && (
                <div
                  className="p-4 md:p-6 text-xs text-gray-400 italic text-center bg-gray-50/50 rounded-lg mx-2 mb-3 border-2 border-dashed border-gray-200"
                  aria-live="polite"
                >
                  Não há tarefas nesta coluna.
                </div>
              )}
            </KanbanBoard>
          )}
        </KanbanProvider>
      )}
    </div>
  );
}
