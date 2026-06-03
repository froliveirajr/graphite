"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function loginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    loginError("Informe e-mail e senha.");
  }

  if (!process.env.DATABASE_URL) {
    loginError("Configure DATABASE_URL para autenticar usuarios.");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    loginError("Credenciais invalidas.");
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    loginError("Credenciais invalidas.");
  }

  await setSessionCookie({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
