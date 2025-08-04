import { salt } from "@/configs/salt";
import { CreateUserInput } from "./user.types";
import bcrypt from "bcryptjs";
import { prisma } from "@/configs/prisma";
import { randomUUID } from "crypto";

export default class UserService {
  async createUser(input: CreateUserInput) {
    const { user_name, email, password } = input;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { user_name }],
      },
    });

    if (existingUser) {
      if (
        existingUser.email === email ||
        existingUser.user_name === user_name
      ) {
        throw new Error("User already exists");
      }
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        user_name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
