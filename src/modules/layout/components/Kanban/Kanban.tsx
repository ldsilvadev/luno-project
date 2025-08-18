"use client";

import { 
  EllipsisVertical, 
  Calendar, 
  User, 
  AlertCircle, 
  Plus,
  Clock,
  CheckCircle,
  Pause,
  Search
} from "lucide-react";
import { useKanban } from "@/hooks";
import { Task, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanProps {
  initialTasks?: Task[];
  onTaskClick?: (task: Task) => void;
  onCreateTask?: (status: TaskStatus) => void;
}

const COLUMN_CONFIG = {
  em_analise: {
    title: "Em Análise",
    icon: Search,
    gradient: "from-indigo-900 to-indigo-200",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-100"
  },
  em_desenvolvimento: {
    title: "Em Desenvolvimento", 
    icon: Clock,
    gradient: "from-blue-900 to-blue-200",
    bgColor: "bg-blue-50",
    textColor: "text-blue-100"
  },
  pausada: {
    title: "Pausada",
    icon: Pause,
    gradient: "from-orange-900 to-orange-200", 
    bgColor: "bg-orange-50",
    textColor: "text-orange-100"
  },
  concluida: {
    title: "Concluída",
    icon: CheckCircle,
    gradient: "from-green-900 to-green-200",
    bgColor: "bg-green-50", 
    textColor: "text-green-100"
  }
} as const;

const PRIORITY_CONFIG = {
  baixa: { color: "bg-green-500", label: "Baixa" },
  media: { color: "bg-yellow-500", label: "Média" },
  alta: { color: "bg-orange-500", label: "Alta" },
  critica: { color: "bg-red-500", label: "Crítica" }
} as const;

export function Kanban({ 
  initialTasks = [], 
  onTaskClick,
  onCreateTask 
}: KanbanProps) {
  const { columns } = useKanban(initialTasks);

  const formatDate = (date?: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return format(d, "dd/MM", { locale: ptBR });
  };

  const renderTaskCard = (task: Task) => {
    const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
      <div
        key={task.id}
        onClick={() => onTaskClick?.(task)}
        className="bg-card border border-border rounded-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30"
      >
        {/* Task Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-card-foreground text-sm leading-5 line-clamp-2">
            {task.title}
          </h4>
          {priorityConfig && (
            <div className={`w-2 h-2 rounded-full ${priorityConfig.color} shrink-0 ml-2 mt-1`} />
          )}
        </div>

        {task.description && (
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Task Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {task.assignee && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{task.assignee}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${
                isOverdue ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <AlertCircle className="w-3 h-3" />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderColumn = (status: TaskStatus) => {
    const config = COLUMN_CONFIG[status];
    const tasks = columns[status];
    const IconComponent = config.icon;

    return (
      <div key={status} className="flex flex-col h-full">
        {/* Column Header */}
        <div className={`bg-gradient-to-br ${config.gradient} rounded-lg p-4 mb-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IconComponent className={`w-5 h-5 ${config.textColor}`} />
              <span className={`text-lg font-bold ${config.textColor}`}>
                {config.title}
              </span>
            </div>
            <EllipsisVertical className={`w-5 h-5 ${config.textColor}`} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${config.textColor}/80`}>
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </span>
            
            {onCreateTask && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCreateTask(status)}
                className={`h-7 w-7 p-0 ${config.textColor} hover:bg-white/20`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tasks Container */}
        <div className="flex-1 min-h-[400px] space-y-0">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <IconComponent className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Nenhuma tarefa</p>
            </div>
          ) : (
            <div className="space-y-0">
              {tasks.map(renderTaskCard)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Object.keys(COLUMN_CONFIG) as TaskStatus[]).map(renderColumn)}
      </div>
    </div>
  );
}
