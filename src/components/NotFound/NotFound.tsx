import { Sparkles, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/modules";
import { ProjectForm } from "@/components";

export function NotFound() {
  const { openModal } = useModal();

  const handleCreateProject = () => {
    openModal({
      title: "Criar um projeto",
      description: "Preencha os campos abaixo para criar um novo projeto",
      content: <ProjectForm />,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="relative mb-3">
        <div className="w-32 h-32 flex items-center justify-center ">
          <Rocket size={64} className="text-indigo-100 animate-pulse" />
        </div>
      </div>

      <div className="space-y-4 mb-8 max-w-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-100 bg-clip-text text-transparent">
          Hora de começar algo incrível!
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Seus projetos aparecerão aqui. Que tal criar o primeiro e dar vida às
          suas ideias?
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          onClick={handleCreateProject}
          className="flex-1 bg-gradient-to-r from-indigo-400 to-indigo-100 hover:from-indigo-500 hover:to-indigo-200 text-background shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-1" />
          Criar Primeiro Projeto
        </Button>

        <Button
          variant="outline"
          className="flex-1 border-2 border-gradient-to-r from-indigo-200 to-purple-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
        >
          <Sparkles size={18} className="mr-1" />
          Com IA
        </Button>
      </div>

      {/* Subtle hint */}
      <p className="text-xs text-muted-foreground/70 mt-6 italic">
        ✨ Dica: Use a IA para gerar ideias e estruturas de projeto
        automaticamente
      </p>
    </div>
  );
}
