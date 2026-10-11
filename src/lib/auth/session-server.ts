import { cookies } from "next/headers";
import type { AuthRole, AuthSession } from "@/lib/auth/mock-auth";
import { createClient } from "@/lib/supabase/server";

export const SESSION_COOKIE = "zaffa_session";

function mapRole(value: string | undefined): AuthRole {
  if (value === "admin" || value === "vendor" || value === "member" || value === "bride") {
    return value;
  }
  return "bride";
}

export function encodeSession(session: AuthSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value: string): AuthSession | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AuthSession;
    if (!parsed?.id || !parsed?.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, account_role")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      return {
        id: String(profile?.id ?? user.id),
        name: String(profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User"),
        email: String(profile?.email ?? user.email ?? ""),
        phone: String(profile?.phone ?? user.user_metadata?.phone ?? ""),
        role: mapRole(String(profile?.account_role ?? "bride")),
        createdAt: user.created_at,
      };
    }
  } catch {
    // Fall through to the cookie session used before Supabase Auth.
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }
  return decodeSession(raw);
}
