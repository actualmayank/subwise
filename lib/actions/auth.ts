"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  name?: string;
  email?: string;
};

export async function signupAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawName = formData.get("name");
  const rawEmail = formData.get("email");
  const carryOver = {
    name: typeof rawName === "string" ? rawName : undefined,
    email: typeof rawEmail === "string" ? rawEmail : undefined,
  };

  const parsed = signupSchema.safeParse({
    name: rawName,
    email: rawEmail,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, ...carryOver };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists.", ...carryOver };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in.", ...carryOver };
    }
    throw error;
  }

  return {};
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const carryOver = { email: typeof email === "string" ? email : undefined };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password.", ...carryOver };
        default:
          return { error: "Something went wrong. Please try again.", ...carryOver };
      }
    }
    throw error;
  }

  return {};
}
