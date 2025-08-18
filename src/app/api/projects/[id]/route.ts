import ProjectService from "@/features/project/project.service";
import { updateProjectSchema } from "@/features/project/project.types";
import { NextRequest, NextResponse } from "next/server";

const projectService = new ProjectService();

// GET /api/projects/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await projectService.getProjectById(id, userId);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
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
    const parsed = updateProjectSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const project = await projectService.updateProject(id, parsed.data, userId);

    return NextResponse.json(project, { status: 200 });
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
    await projectService.deleteProject(id, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Project not found") {
        return NextResponse.json(
          { message: "Project not found" },
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
