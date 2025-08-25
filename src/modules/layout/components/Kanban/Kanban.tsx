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
import { Eye, Trash } from "lucide-react";
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

// App-wide consistent colors
const columns = [
  { id: "todo" as TaskStatus, name: "A Fazer", color: "#A5B4FC" },
  { id: "in_progress" as TaskStatus, name: "Em Progresso", color: "#6366F1" },
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
      title: "Visualizar Tarefa",
      description: "Você pode visualizar e editar os dados da tarefa",
      content: (
        <TaskForm
          initialValues={initialValues}
          projectId={projectId}
          onSuccess={refetchTasks}
        />
      ),
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
        >
          {(column) => (
            <KanbanBoard
              id={column.id}
              key={column.id}
              className="bg-gradient-to-tl from-foreground/25 to-background"
            >
              <KanbanHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span>{column.name}</span>
                </div>
              </KanbanHeader>
              <KanbanCards id={column.id}>
                {(feature: (typeof features)[number]) => (
                  <KanbanCard
                    column={column.id}
                    id={feature.id}
                    key={feature.id}
                    name={feature.name}
                    className="bg-gradient-to-br from-foreground/40 to-background/30 text-background border-foreground/60 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between gap-2 p-3">
                      <div className="flex flex-col gap-2 flex-1">
                        <p className="m-0 font-semibold text-sm leading-tight text-white">
                          {feature.name}
                        </p>
                        {feature.description && (
                          <div
                            className="m-0 text-xs text-indigo-100 leading-relaxed"
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
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          aria-label="Visualizar/Editar tarefa"
                          title="Visualizar/Editar"
                          className="h-6 w-6 p-0 text-indigo-100 hover:text-white hover:bg-indigo-800/50"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(feature);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          aria-label="Excluir tarefa"
                          title="Excluir"
                          className="h-6 w-6 p-0 text-red-100 hover:text-white hover:bg-red-800/50"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(feature.id);
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
              {features.filter((f) => f.column === column.id).length === 0 && (
                <div
                  className="p-3 text-xs text-foreground/50 italic text-center"
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
