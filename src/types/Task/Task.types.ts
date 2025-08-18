export type TaskStatus = "em_analise" | "em_desenvolvimento" | "pausada" | "concluida";

export type TaskPriority = "baixa" | "media" | "alta" | "critica";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  projectId: string;
  order: number;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date | string;
  projectId: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date | string;
  order?: number;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
}