import { prisma } from "@/configs/prisma";
import { randomUUID } from "crypto";
import { CreateTaskInput, UpdateTaskInput } from "./task.types";
import { TaskStatus } from "@prisma/client";

export default class TaskService {
  async createTask(input: CreateTaskInput, authenticatedUserId: string) {
    const { name, description, status, projectId } = input;

    const userExists = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    const task = await prisma.task.create({
      data: {
        id: randomUUID(),
        name,
        description,
        status,
        userId: authenticatedUserId,
        projectId,
      },
    });

    return task;
  }

  async updateTask(
    id: string,
    input: UpdateTaskInput,
    authenticatedUserId: string
  ) {
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: authenticatedUserId },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...input,
      },
    });

    return task;
  }

  async getAllByProjectId(id: string, authenticatedUserId: string) {
    const tasks = prisma.task.findMany({
      where: { projectId: id, userId: authenticatedUserId },
    });

    return tasks;
  }

  async deleteTask(id: string, authenticatedUserId: string) {
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: authenticatedUserId },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    await prisma.task.delete({ where: { id } });
  }

  async changeTaskStatus(
    id: string,
    status: TaskStatus,
    authenticatedUserId: string
  ) {
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: authenticatedUserId },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        status,
      },
    });

    return task;
  }
}
