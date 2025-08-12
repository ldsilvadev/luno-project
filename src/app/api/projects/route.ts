import { NextRequest, NextResponse } from "next/server";
import ProjectService from "@/features/project/project.service";
import { createProjectSchema } from "@/features/project/project.types";

const projectService = new ProjectService();

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = createProjectSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const project = await projectService.createProject(parsed.data, userId);

    return NextResponse.json(project, { status: 201 });
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

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await projectService.getAllByUserId(userId);
    return NextResponse.json(projects, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
