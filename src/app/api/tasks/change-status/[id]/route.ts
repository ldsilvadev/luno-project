import TaskService from "@/features/task/task.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { taskStatusEnum } from "@/features/task/task.types";

const taskService = new TaskService();

const changeStatusSchema = z.object({
  status: taskStatusEnum,
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = changeStatusSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await taskService.changeTaskStatus(
      id,
      parsed.data.status,
      userId
    );

    return NextResponse.json(task, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      if (error.message === "Task not found") {
        return NextResponse.json(
          { message: "Task not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}