import { prisma } from "@/configs/prisma";
import { randomUUID } from "crypto";
import { CreateProjectInput, UpdateProjectInput } from "./project.types";

export default class ProjectService {
  async createProject(input: CreateProjectInput, authenticatedUserId: string) {
    const { name, description, start_date, end_date, status } = input;

    const userExists = await prisma.user.findUnique({ where: { id: authenticatedUserId } });

    if (!userExists) {
      throw new Error("User not found");
    }

    const project = await prisma.project.create({
      data: {
        id: randomUUID(),
        name,
        description,
        userId: authenticatedUserId,
        start_date,
        end_date,
        status,
      },
    });

    return project;
  }

  async updateProject(id: string, input: UpdateProjectInput, authenticatedUserId: string) {
    const existingProject = await prisma.project.findFirst({ where: { id, userId: authenticatedUserId } });
    
    if (!existingProject) {
      throw new Error("Project not found");
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...input,
      },
    });

    return project;
  }

  async getProjectById(id: string, authenticatedUserId: string) {
    const project = await prisma.project.findFirst({ where: { id, userId: authenticatedUserId } });
    return project;
  }

  async getAllByUserId(authenticatedUserId: string) {
    const projects = await prisma.project.findMany({
      where: { userId: authenticatedUserId },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  }

  async deleteProject(id: string, authenticatedUserId: string) {
    const existingProject = await prisma.project.findFirst({ where: { id, userId: authenticatedUserId } });
    
    if (!existingProject) {
      throw new Error("Project not found");
    }

    await prisma.project.delete({ where: { id } });
  }
}
