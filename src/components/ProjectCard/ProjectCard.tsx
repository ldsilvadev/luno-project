import {
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  EllipsisVertical,
  Calendar,
  CalendarCheck,
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
import { sanitizeHtml } from "@/lib/utils";

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
    return format(localDateOnly, "dd/MM/yyyy");
  };

  const handleStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            <PlayCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Em andamento</span>
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Concluído</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full border border-gray-200">
            <span className="text-xs font-medium">Novo</span>
          </div>
        );
    }
  };

  return (
    <div className="group w-full max-w-sm bg-background/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-foreground/20 overflow-hidden">
      <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex-1">
          {handleStatus(project.status)}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
              aria-label="Ações do projeto"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onView?.(project)} className="cursor-pointer">
              <ExternalLink className="mr-2 h-4 w-4" /> Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(project)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(project.id)}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-tight">
          {project.name}
        </h3>
        
        {project.description && (
          <p
            className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed"
            title={sanitizeHtml(project.description || "").replace(
              /<[^>]+>/g,
              ""
            )}
          >
            {sanitizeHtml(project.description || "").replace(/<[^>]+>/g, "")}
          </p>
        )}

        {/* Datas com ícones específicos */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <Calendar className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="font-semibold text-xs">Início</span>
            </div>
            <span className="text-foreground/80 font-medium flex-1 text-right">
              {formatDate(project.start_date as unknown as Date) || 'Não definido'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-rose-600">
              <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center">
                <CalendarCheck className="w-3 h-3 text-rose-600" />
              </div>
              <span className="font-semibold text-xs">Fim</span>
            </div>
            <span className="text-foreground/80 font-medium flex-1 text-right">
              {formatDate(project.end_date as unknown as Date) || 'Não definido'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
