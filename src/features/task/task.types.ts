import { z } from "zod";

export const taskStatusEnum = z.enum(["todo", "in_progress", "completed"]);
export type TaskStatus = z.infer<typeof taskStatusEnum>;

export const createTaskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters long"),
  description: z.string(),
  status: taskStatusEnum.optional(),
  projectId: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  name: z
    .string()
    .min(3, "Task name must be at least 3 characters long")
    .optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
