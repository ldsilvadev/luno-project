import UserService from "@/features/user/user.service";
import { NextRequest } from "next/server";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await userService.createUser(body);
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      if (error.message === "User already exists") {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      return new Response(error.message, { status: 500 });
    }
  }
}
