import { prisma } from "@/configs/prisma";
import { TLoginSchema, TResetPasswordSchema } from "./auth.schema";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import sendEmail from "./utils/send-email";
import { salt } from "@/configs/salt";

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
      console.log(
        "[AuthService] Token signed for user:",
        user.id,
        "len:",
        token.length
      );
    }

    return { token, user };
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = addHours(new Date(), 1);

    await prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    sendEmail(email, token);

    return { message: "Password reset email sent" };
  }

  async resetPassword(input: TResetPasswordSchema) {
    const { token, password } = input;

    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    if (!passwordResetToken) {
      throw new Error("Invalid token");
    }

    // Verificar se o token não expirou
    if (passwordResetToken.expiresAt < new Date()) {
      // Remover token expirado
      await prisma.passwordResetToken.delete({
        where: { id: passwordResetToken.id },
      });
      throw new Error("Token expired");
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    await prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    });

    return { message: "Password reset successful" };
  }
}
