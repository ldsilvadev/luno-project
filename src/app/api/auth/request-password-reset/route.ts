import { requestPasswordResetSchema } from "@/features";
import { AuthService } from "@/features/auth/auth.service";
import { NextRequest, NextResponse } from "next/server";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = requestPasswordResetSchema.parse(body);

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log("[request-password-reset route] Processing password reset request for:", validatedBody.email);
    }

    const result = await authService.requestPasswordReset(validatedBody.email);

    if (isDev) {
      console.log("[request-password-reset route] Password reset email sent successfully");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";
    
    let errorMessage = "An unexpected error occurred.";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message === "User not found") {
        statusCode = 404;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    if (isDev) {
      console.log("[request-password-reset route] Password reset request failed:", errorMessage);
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}