
import { AuthService, loginSchema } from "@/features";
import { NextRequest, NextResponse } from "next/server";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = loginSchema.parse(body);

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log("[login route] Processing login for:", validatedBody.email);
    }

    const result = await authService.login(validatedBody);

    if (isDev) {
      console.log("[login route] Login successful, token emitted");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";
    
    let errorMessage = "An unexpected error occurred.";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (
        error.message === "Invalid email or password"
      ) {
        statusCode = 401;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    if (isDev) {
      console.log("[login route] Login failed:", errorMessage);
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}