import { AuthService, resetPasswordSchema } from "@/features";
import { NextRequest, NextResponse } from "next/server";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = resetPasswordSchema.parse(body);

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log("[reset-password route] Processing password reset with token");
    }

    const result = await authService.resetPassword(validatedBody);

    if (isDev) {
      console.log("[reset-password route] Password reset successful");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";
    
    let errorMessage = "An unexpected error occurred.";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message === "Invalid token") {
        statusCode = 400;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    if (isDev) {
      console.log("[reset-password route] Password reset failed:", errorMessage);
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}