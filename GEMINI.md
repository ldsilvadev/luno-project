# Contexto da Conversa: Planejamento do SaaS para Devs Freelancers

Este documento é um resumo de todo o planejamento estratégico e técnico para um novo aplicativo SaaS, gerado em uma conversa com o Gemini. O objetivo é servir como contexto para futuras interações.

---

### 1. Ideia Inicial e Refinamento Estratégico

*   **Conceito Original:** Um SaaS de gerenciamento de projetos e colaboradores para pequenas empresas, com um plano gratuito para projetos pessoais.
*   **Análise:** O mercado é competitivo. A recomendação foi **focar em um nicho específico** para se diferenciar, em vez de competir com gigantes como Asana e Trello de forma genérica.
*   **Nicho Escolhido:** **Desenvolvedores de Software Freelancers**. Este público tem dores específicas que a ferramenta pode resolver de forma única.

---

### 2. Proposta de Valor para o Nicho

*   **Problema do Nicho:** Devs freelancers precisam ser uma "empresa de uma pessoa só", gerenciando projetos, clientes, tempo e faturamento, geralmente com uma colcha de retalhos de ferramentas (Trello, Planilhas, E-mail).
*   **Solução Proposta (O Diferencial):** Uma plataforma **tudo-em-um** que integra nativamente:
    1.  **Gestão de Projetos (Kanban)**
    2.  **Rastreamento de Tempo (Time Tracking)**
    3.  **Gestão de Clientes**
    4.  **Portal de Visualização para o Cliente** (um grande atrativo)

---

### 3. Stack de Tecnologia e Arquitetura

*   **Arquitetura Geral:** **Monolito Modular**. Começar com um monolito para agilizar o desenvolvimento e reduzir a complexidade inicial, mas com uma estrutura de código organizada que permite extrair serviços no futuro, se necessário.
*   **Framework:** **Next.js** (usando App Router) para front-end e back-end.
*   **Linguagem:** **TypeScript**.
*   **Banco de Dados:** **PostgreSQL**.
*   **ORM:** **Prisma**.

#### Arquitetura de Backend (Dentro do Monolito)

Para manter o código organizado, escalável e testável, adotaremos uma arquitetura de camadas:

*   **Controller (API Route):** Localizado em `src/app/api/**/route.ts`. É a camada mais externa, responsável por lidar com requisições/respostas HTTP. Ele valida a entrada, chama a camada de serviço e retorna o resultado.
*   **Service:** Localizado em `src/features/**/{feature}.service.ts`. Contém a lógica de negócio pura (o "cérebro" da operação). Não tem conhecimento sobre HTTP e é chamado pelo Controller.
*   **Repository (Prisma Client):** O Prisma Client, instanciado em `src/lib/prisma.ts`, atua como nossa camada de acesso a dados (Repository Pattern).

---

### 4. Funcionalidades Essenciais (MVP)

*   **Gestão de Clientes:** CRUD para clientes.
*   **Gestão de Projetos:** Quadro Kanban vinculado a clientes com taxa/hora (`hourlyRate`).
*   **Gerador de Projetos com IA:** Funcionalidade inicial de IA para criar um projeto e tarefas a partir de um briefing.
*   **Tarefas com Time Tracking:** Botão de play/pause/stop dentro de cada tarefa.
*   **Portal do Cliente:** Link secreto para o cliente visualizar o progresso.
*   **Dashboard Simples:** Resumo de horas trabalhadas e valor a faturar.

---

### 5. Modelo de Dados Proposto (Schema)

Schema relacional para o Prisma, conectando `User`, `Client`, `Project`, `Task`, e `TimeEntry`.

```prisma
model User { // ... }
model Client { // ... }
model Project { // ... }
model Task { // ... }
model TimeEntry { // ... }
```

---

### 6. Oportunidades com Inteligência Artificial

A IA será um diferencial para automatizar tarefas e fornecer insights.

#### Nível 1 (MVP): Detalhamento do Gerador de Projetos com IA

*   **Objetivo:** Economizar tempo no setup inicial de um projeto.
*   **Fluxo do Usuário:**
    1.  O usuário clica em "Criar Projeto com IA ✨".
    2.  Cola o briefing do cliente em um campo de texto.
    3.  Ao clicar em "Gerar", a IA analisa o texto e cria um rascunho do projeto.
    4.  O usuário é levado para a página do projeto, com nome, resumo e tarefas já preenchidas no Kanban, prontas para edição.
*   **Lógica de Implementação:**
    1.  **Frontend (React):** Um formulário simples captura o briefing.
    2.  **Backend (API Route):** Uma API em `src/app/api/projects/generate/route.ts` (Controller) recebe o texto.
    3.  **Service Layer:** A API Route chama um serviço em `src/features/projects/project.service.ts`.
    4.  **Prompt Engineering:** O serviço monta um prompt detalhado, instruindo a IA a retornar um objeto JSON com uma estrutura específica (`projectName`, `projectSummary`, `tasks: [{title, category}]`).
    5.  **Criação no DB:** O serviço recebe o JSON, valida os dados e usa uma transação do Prisma para criar o projeto e suas tarefas de forma atômica.

#### Nível 2 (Avançado):
*   **Estimativa de Tempo Inteligente:** IA aprende com o histórico do usuário para estimar a duração de novas tarefas.
*   **Identificação de Riscos:** IA alerta proativamente sobre possíveis atrasos.

#### Nível 3 (Visão de Futuro):
*   **Assistente Conversacional:** Um chatbot para interagir com os dados do projeto em linguagem natural.

---

### 7. Prompt para Documentação (Perplexity)

(Seção mantida como referência para geração de documentação externa)

Foi gerado um prompt detalhado para ser usado em uma ferramenta como o Perplexity.ai, instruindo-o a agir como um arquiteto de software e criar uma documentação técnica completa, incluindo:
1.  Análise e recomendação do banco de dados.
2.  Schema detalhado do banco de dados.
3.  Especificação da API (endpoints).
4.  Arquitetura de componentes do front-end.