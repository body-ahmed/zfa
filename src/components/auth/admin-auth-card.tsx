"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRight, HeartHandshake, Phone, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthRole, AuthSession } from "@/lib/auth/mock-auth";

const roleCards: Array<{ value: AuthRole; title: string; description: string; accent: string }> = [
  { value: "bride", title: "Bride & Groom", description: "Plan your celebration and pay vendors from your wallet.", accent: "from-rose-500 to-fuchsia-500" },
  { value: "vendor", title: "Service Provider", description: "Receive booking payments into your Zaffa wallet.", accent: "from-sky-500 to-cyan-500" },
  { value: "member", title: "Guest / Planner", description: "Stay updated, coordinate plans, and keep a shared wallet.", accent: "from-violet-500 to-indigo-500" },
];

function mapSession(userId: string, email: string, metadata: Record<string, unknown>, profile?: { id?: string; full_name?: string; phone?: string; account_role?: string } | null): AuthSession {
  const role = (profile?.account_role ?? metadata.account_role ?? "bride") as AuthRole;
  return {
    id: profile?.id ?? userId,
    name: String(profile?.full_name ?? metadata.full_name ?? email.split("@")[0]),
    email,
    phone: String(profile?.phone ?? metadata.phone ?? ""),
    role: ["admin", "vendor", "member", "bride"].includes(role) ? role : "bride",
    createdAt: new Date().toISOString(),
  };
}

export function AdminAuthCard() {
  const locale = useLocale();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<AuthRole>("bride");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [message, setMessage] = useState("Create an account or sign in with email and password. Each account gets a wallet.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, phone, account_role")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();
      setSession(mapSession(data.user.id, data.user.email ?? "", data.user.user_metadata ?? {}, profile));
    });
  }, []);

  const isAdmin = useMemo(() => session?.role === "admin", [session]);

  async function handleSubmit() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setMessage("Email and password are required.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setMessage("Please enter your name.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
            account_role: role === "admin" ? "member" : role,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signInError) {
          setMessage("Account created. If login is blocked, confirm the email from Supabase Auth settings, then sign in.");
          setLoading(false);
          return;
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setMessage("Signed in, but the session could not be loaded. Refresh and try again.");
      setLoading(false);
      return;
    }

    await supabase.rpc("ensure_my_profile");
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, phone, account_role")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    const nextSession = mapSession(user.id, user.email ?? trimmedEmail, user.user_metadata ?? {}, profile);
    setSession(nextSession);
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextSession),
    });
    setMessage("Signed in. Your profile is ready.");
    window.location.href = `/${locale}/profile`;
    setLoading(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/auth/session", { method: "DELETE" });
    setSession(null);
    setMessage("Logged out. You can sign in again.");
  }

  if (session) {
    return (
      <div className="rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary-container p-3 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Welcome back</p>
            <h2 className="font-display text-title-lg font-semibold text-on-background">{session.name}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-on-surface-variant">
          Signed in as <span className="font-semibold text-on-background">{session.email}</span> with {session.role} access.
        </p>

        <div className="mt-5 rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">
          {isAdmin ? "You can open the admin workspace from the private admin link." : "Your profile is ready. Add photos, prices, and available dates."}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/${locale}/profile`}>Open profile</Link>
          </Button>
          {isAdmin ? (
            <Button asChild>
              <Link href={`/${locale}/admin`}>Admin</Link>
            </Button>
          ) : null}
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-6 shadow-sm backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-outline-variant/60 bg-gradient-to-br from-primary/10 via-background to-secondary-container/40 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-container p-3 text-primary">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Zaffa experience</p>
              <h2 className="font-display text-title-lg font-semibold text-on-background">Start your elegant wedding journey</h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">• Email and password only — no OTP</div>
            <div className="inline-flex w-full items-start gap-2 rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">
              <Wallet className="mt-0.5 h-4 w-4 text-primary" />
              Each account gets a wallet. Booking payments go to the vendor wallet.
            </div>
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">• Dashboard for plans, vendors, bookings, and balance</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Access your account</p>
              <h2 className="font-display text-title-lg font-semibold text-on-background">
                {mode === "signup" ? "Create account" : "Sign in"}
              </h2>
            </div>
            <div className="rounded-full bg-primary-container p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 flex gap-2 rounded-full border border-outline-variant/60 bg-background/70 p-1">
            <button
              type="button"
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${mode === "signin" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              onClick={() => {
                setMode("signin");
                setMessage("Sign in with your email and password.");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${mode === "signup" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              onClick={() => {
                setMode("signup");
                setMessage("Create an account. A wallet will be created automatically.");
              }}
            >
              Create account
            </button>
          </div>

          {mode === "signup" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {roleCards.map((card) => (
                <button
                  key={card.value}
                  type="button"
                  onClick={() => setRole(card.value)}
                  className={`rounded-2xl border p-3 text-left text-sm ${role === card.value ? "border-primary bg-primary/10" : "border-outline-variant/60 bg-background/70"}`}
                >
                  <div className={`mb-2 h-2 rounded-full bg-gradient-to-r ${card.accent}`} />
                  <p className="font-semibold text-on-background">{card.title}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{card.description}</p>
                </button>
              ))}
            </div>
          )}

          {mode === "signup" && (
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-2xl border border-outline-variant/60 bg-background/70 px-4 py-3 text-sm outline-none"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-2xl border border-outline-variant/60 bg-background/70 px-4 py-3 text-sm outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className="w-full rounded-2xl border border-outline-variant/60 bg-background/70 px-4 py-3 text-sm outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {mode === "signup" ? (
              <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/60 bg-background/70 px-4 py-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            ) : null}
          </div>

          {message ? <p className="mt-4 text-sm text-on-surface-variant">{message}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
