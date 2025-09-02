"use client";

import { NotFound, ProjectCard, ProjectForm } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDelete, useGet } from "@/hooks";
import { useModal } from "@/modules";
import { GetProject } from "@/types";
import {
  Plus,
  Sparkles,
  Search,
  Filter,
  FolderOpen,
  Clock,
  CheckCircle,
  AppWindow,
} from "lucide-react";
import { useState } from "react";
import { Loader } from "@/modules";
import { useRouter } from "next/navigation";

export default function Projetos() {
  const { openModal } = useModal();
  const { data, refetch, isLoading } = useGet<GetProject[]>("api/projects");
  const { handleDelete } = useDelete({
    endPoint: "api/projects",
    onSuccess: refetch,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const router = useRouter();

  const handleCreateProject = () => {
    openModal({
      title: "Criar um projeto",
      description: "Preencha os campos abaixo para criar um novo projeto",
      content: <ProjectForm onSuccess={refetch} />,
    });
  };

  const handleCreateWithAI = () => {
    openModal({
      title: "Criar projeto com IA",
      description:
        "Descreva sua ideia e a IA criará a estrutura do projeto para você",
      content: <ProjectForm />,
    });
  };

  return (
    <section className="w-full">
      <header className="w-full bg-background bg-gradient-to-r from-foreground/25 to-foreground/15  border-b border-indigo-100">
        <div className="px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-foreground/25 to-background rounded-xl shadow-lg">
                <AppWindow size={24} className="text-foreground/60" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground/70 to-foreground/30 bg-clip-text text-transparent">
                  Seus Projetos
                </h1>
                <p className="text-sm text-foreground/40">
                  {data?.length
                    ? `${data.length} projeto${
                        data.length > 1 ? "s" : ""
                      } encontrado${data.length > 1 ? "s" : ""}`
                    : "Nenhum projeto criado"}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-foreground/60 to-foreground/30 hover:from-foreground/60 hover:to-foreground/40 text-background shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={18} className="mr-1" />
                Novo Projeto
              </Button>
              <Button
                onClick={handleCreateWithAI}
                variant="outline"
                className="border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/10 transition-all duration-300 group"
              >
                <Sparkles size={18} className="mr-1" />
                Com IA
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden lg:flex bg-background/70 rounded-lg p-1">
                {[
                  { key: "todos", label: "Todos", icon: FolderOpen },
                  { key: "andamento", label: "Em andamento", icon: Clock },
                  { key: "concluidos", label: "Concluídos", icon: CheckCircle },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        activeFilter === key
                          ? "bg-gradient-to-r from-foreground/60 to-foreground/30 text-background shadow-sm"
                          : "text-gray-600 hover:text-foreground hover:bg-foreground/10"
                      }
                    `}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </nav>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter size={18} className="mr-2" />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setActiveFilter("todos")}>
                    <FolderOpen size={16} className="mr-2" />
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveFilter("andamento")}
                  >
                    <Clock size={16} className="mr-2" />
                    Em andamento
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveFilter("concluidos")}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Concluídos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex lg:hidden gap-2 mt-4">
            <Button
              onClick={handleCreateProject}
              className="flex-1 bg-gradient-to-r from-foreground/60 to-foreground/30 hover:from-foreground/60 hover:to-foreground/40 text-background shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={18} className="mr-1" />
              Novo Projeto
            </Button>
            <Button
              onClick={handleCreateWithAI}
              variant="outline"
              className="flex-1 border-foreground/60 hover:bg-gradient-to-r hover:from-background/10 hover:to-foreground/10 transition-all duration-300"
            >
              <Sparkles size={18} className="mr-1" />
              Com IA
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full mt-8 px-4 sm:px-6 lg:px-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <Loader count={3} />
          </div>
        ) : data?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {data.map((project) => (
              <div key={project.id} className="flex justify-center">
                <ProjectCard
                  project={project}
                  onView={(p) => router.push(`/projetos/${p.id}`)}
                  onEdit={() =>
                    openModal({
                      title: "Editar projeto",
                      description: "Faça alterações em seu projeto",
                      content: (
                        <ProjectForm
                          initialValues={project}
                          onSuccess={refetch}
                        />
                      ),
                    })
                  }
                  onDelete={() => handleDelete(project.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <NotFound />
          </div>
        )}
      </div>
    </section>
  );
}
