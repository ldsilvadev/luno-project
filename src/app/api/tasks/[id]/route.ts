import TaskService from "@/features/task/task.service";
import { updateTaskSchema } from "@/features/task/task.types";
import { NextRequest, NextResponse } from "next/server";

const taskService = new TaskService();

export async function PUT(
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
    const parsed = updateTaskSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await taskService.updateTask(id, parsed.data, userId);

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await taskService.deleteTask(id, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
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