import type { AuthSession } from "@/lib/auth/mock-auth";

function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminSession(session: AuthSession | null | undefined) {
  if (!session) {
    return false;
  }
  if (session.role === "admin") {
    return true;
  }
  return adminEmails().includes(session.email.toLowerCase());
}
