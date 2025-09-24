import { Sparkles, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/modules";
import { ProjectForm } from "@/components";

export function NotFound({refetch}: {refetch?: () => void}) {
  const { openModal } = useModal();

  const handleCreateProject = () => {
    openModal({
      title: "Criar um projeto",
      description: "Preencha os campos abaixo para criar um novo projeto",
      content: <ProjectForm onSuccess={refetch} />,
      sizeClassName:
        "!max-w-[80%] lg:!max-w-[800px]  lg2:!max-w-[800px] max-h-[95%] overflow-y-auto",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="relative mb-3">
        <div className="w-32 h-32 flex items-center justify-center ">
          <Rocket size={64} className="text-foreground/40 animate-pulse" />
        </div>
      </div>

      <div className="space-y-4 mb-8 max-w-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground/70 to-foreground/30 bg-clip-text text-transparent">
          Hora de começar algo incrível!
        </h2>
        <p className="text-foreground/40 text-base leading-relaxed">
          Seus projetos aparecerão aqui. Que tal criar o primeiro e dar vida às
          suas ideias?
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          onClick={handleCreateProject}
          className="flex-1 bg-gradient-to-r from-foreground/60 to-foreground/30 hover:from-foreground/60 hover:to-foreground/40 text-background shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-1" />
          Criar Primeiro Projeto
        </Button>

        <Button
          variant="outline"
          className="flex-1 border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/10 transition-all duration-300"
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
