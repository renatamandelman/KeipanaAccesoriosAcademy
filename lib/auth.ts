import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type Clienta } from "@shared/schema";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "keipana-secret-2026-super-secure"
);

export type JwtPayload = {
  id: string;
  mail: string;
  isAdmin: boolean;
};

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function clientaToPayload(c: Clienta): JwtPayload {
  return { id: c.id, mail: c.mail, isAdmin: c.isAdmin };
}
