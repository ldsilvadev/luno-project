import { NextRequest, NextResponse } from "next/server";
import TaskService from "@/features/task/task.service";
import { createTaskSchema } from "@/features/task/task.types";

const taskService = new TaskService();

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = createTaskSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await taskService.createTask(parsed.data, userId);

    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return NextResponse.json(
          { message: "User not found" },
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