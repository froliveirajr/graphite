import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const sessionCookieName = "graphite_session";

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "graphite-dev-session-secret-change-me";
  }

  throw new Error("Configure SESSION_SECRET para usar autenticacao em producao.");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string): SessionPayload | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export function createSessionToken(payload: SessionPayload) {
  const encoded = encodePayload(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = sign(encoded);
  const actual = Buffer.from(signature, "base64url");
  const expected = Buffer.from(expectedSignature, "base64url");

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  const payload = decodePayload(encoded);

  if (!payload || payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}

export async function setSessionCookie(payload: Omit<SessionPayload, "expiresAt">) {
  const maxAge = 60 * 60 * 24 * 7;
  const expiresAt = Date.now() + maxAge * 1000;
  const token = createSessionToken({ ...payload, expiresAt });

  (await cookies()).set({
    name: sessionCookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set({
    name: sessionCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export const getCurrentSession = cache(async () => {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return readSessionToken(token);
});

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
