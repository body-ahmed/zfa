import { NextResponse } from "next/server";
import type { AuthSession } from "@/lib/auth/mock-auth";
import { SESSION_COOKIE, encodeSession } from "@/lib/auth/session-server";

export async function POST(request: Request) {
  let body: AuthSession;

  try {
    body = (await request.json()) as AuthSession;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid session payload." }, { status: 400 });
  }

  if (!body.id || !body.email || !body.name) {
    return NextResponse.json({ ok: false, message: "Session is missing required fields." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, encodeSession(body), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
