import { prisma } from "@/configs/prisma";
import { TLoginSchema } from "./auth.schema";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class AuthService {
  async login(input: TLoginSchema) {
    const { email, password } = input;

    const JWT_SECRET = "secretpassword";
    const isDev = process.env.NODE_ENV !== "production";

    if (isDev) {
      console.log("[AuthService] JWT_SECRET present:", Boolean(JWT_SECRET));
    }
    
    if (!JWT_SECRET) {
      throw new Error("Server misconfigured: JWT secret not set");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    if (isDev) {
      console.log("[AuthService] Token signed for user:", user.id, "len:", token.length);
    }

    return { token, user };
  }
}
