import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { User } from "@/types";

export function generateToken(user: { id: string; email: string; role: string }): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64");
  return `pk_${payload}`;
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    if (!token.startsWith("pk_")) return null;
    const raw = Buffer.from(token.replace("pk_", ""), "base64").toString("utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const found = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (found.length === 0) return null;
    return found[0] as User;
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<any | null> {
  try {
    const found = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (found.length === 0) return null;
    return found[0];
  } catch (error) {
    console.error("getUserByEmail error:", error);
    return null;
  }
}

export function requireAdmin(user: User | null): boolean {
  return user !== null && user.role === "admin";
}

export function requireCustomer(user: User | null): boolean {
  return user !== null;
}
