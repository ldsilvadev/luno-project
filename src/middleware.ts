import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, decodeJwt, decodeProtectedHeader } from "jose";

const PUBLIC_API_PATHS = ["/api/auth/login", "/api/users", "/api/auth/request-password-reset", "/api/auth/reset-password"];

interface TokenPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token) {
    token = req.cookies.get("token")?.value ?? null;
  }

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    console.log("[middleware] JWT_SECRET present:", Boolean(JWT_SECRET));
    console.log("[middleware] Token len:", token.length);
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      { message: "Server misconfigured: JWT secret not set" },
      { status: 500 }
    );
  }

  const secret = new TextEncoder().encode(JWT_SECRET);

  try {
    
    const header = decodeProtectedHeader(token);
    const payloadUnverified = decodeJwt(token) as TokenPayload;

    if (isDev) {
      const headerAlg = header?.alg ?? null;
      const hasId = Boolean(payloadUnverified?.id);
      const expTs = payloadUnverified?.exp ?? null;
      console.log("[middleware] decoded (unverified) alg:", headerAlg, "hasId:", hasId, "exp:", expTs);
    }

    const verified = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    const payload = verified.payload as unknown as TokenPayload;

    if (isDev) {
      console.log("[middleware] decoded ok:", Boolean(payload));
    }

    if (typeof payload !== "object" || payload === null || !("id" in payload)) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id: userId } = payload as TokenPayload;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", String(userId));

    if (isDev) {
      console.log("[middleware] Token verified, user:", userId);
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    const err = error as { name?: string; message?: string };
    if (isDev) console.log("[middleware] Verify error:", err?.name, err?.message);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
