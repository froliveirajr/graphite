import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const keyLength = 64;

function toBase64Url(value: Buffer) {
  return value.toString("base64url");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scryptAsync(password, salt, keyLength)) as Buffer;

  return `scrypt$${toBase64Url(salt)}$${toBase64Url(derivedKey)}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return Boolean(process.env.GRAPHITE_SEED_PASSWORD && storedHash === "dev-placeholder-change-before-production" && password === process.env.GRAPHITE_SEED_PASSWORD);
  }

  const storedKey = Buffer.from(hash, "base64url");
  const derivedKey = (await scryptAsync(password, Buffer.from(salt, "base64url"), storedKey.length)) as Buffer;

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}
