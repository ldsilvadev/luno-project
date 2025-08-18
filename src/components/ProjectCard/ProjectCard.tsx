import {
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  EllipsisVertical,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetProject } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProjectCardProps {
  project: GetProject;
  onEdit?: (project: GetProject) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: GetProject) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const localDateOnly = new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate()
    );
    return format(localDateOnly, "dd 'de' MMM 'de' yyyy", { locale: ptBR });
  };

  const handleStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-indigo-200" />
            <span>Em andamento</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-lime-200" />
            <span>Concluido</span>
          </div>
        );
      default:
        return "Novo";
    }
  };

  return (
    <div className="min-w-full md:min-w-md flex flex-col border border-indigo-100 rounded bg-gradient-to-br from-primary to-primary/20 m-0">
      <div className="flex w-full items-center justify-between px-4 pt-2">
        {handleStatus(project.status)}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ações do projeto">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onView?.(project)}>
                <ExternalLink className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(project.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full px-4 pb-4">
        <span className="text-lg font-bold">{project.name}</span>
      </div>
      <div className="w-full py-3 px-4 bg-gradient-to-br from-indigo-900 to-indigo-200">
        <div className="flex gap-5 items-center flex-wrap">
          <div className="flex gap-1 items-center">
            <Play className="w-4 h-4 text-indigo-100 text-xs" />
            <span className="text-indigo-100 text-xs">
              {formatDate(project.start_date as unknown as Date)}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <X className="w-4 h-4 text-indigo-100 text-xs" />
            <span className="text-indigo-100 text-xs">
              {formatDate(project.end_date as unknown as Date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
