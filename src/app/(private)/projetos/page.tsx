"use client";

import { ProjectForm } from "@/components";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks";
import { useModal } from "@/modules";
import { GetProject } from "@/types";
import { useEffect } from "react";

export default function Projetos() {
  const { openModal } = useModal();
  const { data } = useGet<GetProject[]>("api/projects");

  useEffect(() => {
    console.log("Projetos", data);
  }, [data]);

  return (
    <section className="w-full">
      <header className="w-full flex flex-col gap-2">
        <span className="text-2xl font-semibold text-foreground">
          Seus Projetos
        </span>
        <div className="w-full flex flex-col md:items-center md:flex-row md:justify-between gap-2">
          <nav className="hidden md:block">
            <ul className="flex gap-4">
              <li>  
                <span className="text-indigo-100">Em andamento</span>
              </li>
              <li>
                <span className="text-indigo-100">Concluidos</span>
              </li>
            </ul>
          </nav>
          <Button className="block md:hidden bg-indigo-100 hover:bg-indigo-50">
            Filtrar
          </Button>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              onClick={() =>
                openModal({
                  title: "Criar um projeto",
                  description:
                    "Preencha os campos abaixo para criar um novo projeto",
                  content: <ProjectForm />,
                })
              }
              className="w-full md:w-auto"
            >
              Novo Projeto
            </Button>
            <Button className="w-full md:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg animate-pulse hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400 transition-opacity">
              Criar projeto com IA
            </Button>
          </div>
        </div>
      </header>
    </section>
  );
}
