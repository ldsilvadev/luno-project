"use client";

import { useCallback, useMemo, useState } from "react";
import { DragResult, Task, TaskStatus } from "@/types";

export function useKanban(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(() => initialTasks ?? []);

  const columns = useMemo(() => {
    const base: Record<TaskStatus, Task[]> = {
      em_analise: [],
      em_desenvolvimento: [],
      pausada: [],
      concluida: [],
    };
    tasks
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((t) => base[t.status].push(t));
    return base;
  }, [tasks]);

  const onDragEnd = useCallback((result: DragResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    if (sourceStatus === destStatus && source.index === destination.index) return;

    setTasks((prev) => {
      const next = [...prev];
      const movedIndex = next.findIndex((t) => t.id === draggableId);
      if (movedIndex === -1) return prev;

      const moved = { ...next[movedIndex] };
      moved.status = destStatus;

      const filtered = next.filter((t) => t.id !== draggableId);

      // recalcula ordem dentro de cada coluna
      const before = filtered
        .filter((t) => t.status === destStatus)
        .sort((a, b) => a.order - b.order);

      before.splice(destination.index, 0, moved);
      before.forEach((t, idx) => (t.order = idx));

      const other = filtered
        .filter((t) => t.status !== destStatus)
        .map((t) => ({ ...t }));

      return [...other, ...before];
    });
  }, []);

  return { tasks, setTasks, columns, onDragEnd } as const;
}