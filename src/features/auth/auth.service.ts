import { prisma } from "@/configs/prisma";
import { TLoginSchema } from "./auth.schema";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export class AuthService {
  async login(input: TLoginSchema) {
    const { email, password } = input;

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

    return { token, user };
  }
}
