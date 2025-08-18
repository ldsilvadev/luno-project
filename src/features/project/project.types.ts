import { z } from "zod";

export const projectStatusEnum = z.enum(["in_progress", "completed"]);
export type ProjectStatus = z.infer<typeof projectStatusEnum>;

export const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long"),
  description: z.string(),
  start_date: z.string().datetime().transform((val) => new Date(val)),
  end_date: z.string().datetime().transform((val) => new Date(val)),
  status: projectStatusEnum.optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long").optional(),
  description: z.string().optional(),
  start_date: z.string().datetime().transform((val) => new Date(val)),
  end_date: z.string().datetime().transform((val) => new Date(val)),
  status: projectStatusEnum.optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;