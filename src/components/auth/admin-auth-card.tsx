"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRight, HeartHandshake, Phone, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { createAccount, getStoredSession, requestOtp, verifyOtp, type AuthRole, type AuthSession } from "@/lib/auth/mock-auth";

const roleCards: Array<{ value: AuthRole; title: string; description: string; accent: string }> = [
  { value: "bride", title: "Bride & Groom", description: "Plan your celebration from venue to vendors with style and clarity.", accent: "from-rose-500 to-fuchsia-500" },
  { value: "vendor", title: "Service Provider", description: "Showcase your services, reach couples, and manage your bookings.", accent: "from-sky-500 to-cyan-500" },
  { value: "member", title: "Guest / Planner", description: "Stay updated, coordinate plans, and enjoy a premium experience.", accent: "from-violet-500 to-indigo-500" },
];

export function AdminAuthCard() {
  const locale = useLocale();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<AuthRole>("bride");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@zaffa.com");
  const [password, setPassword] = useState("Admin123!");
  const [phone, setPhone] = useState("+966500000000");
  const [otp, setOtp] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [message, setMessage] = useState("Choose your path and continue with a secure sign-in flow.");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = getStoredSession();
    if (current) {
      setSession(current);
    }
  }, []);

  const isAdmin = useMemo(() => session?.role === "admin", [session]);

  async function handleRequestOtp() {
    setLoading(true);
    setMessage("");
    if (mode === "signup") {
      const result = createAccount(name, email, password, phone, role);
      if (!result.ok) {
        setMessage(result.message);
        setLoading(false);
        return;
      }
      setMessage(result.message);
      setOtpSent(true);
      setLoading(false);
      return;
    }

    const result = requestOtp(email, password, phone);
    if (!result.ok) {
      setMessage(result.message);
      setLoading(false);
      return;
    }
    setOtpSent(true);
    setMessage(`${result.message} Demo code: ${result.code}`);
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setMessage("");
    const result = verifyOtp(email, otp);
    if (!result.ok) {
      setMessage(result.message);
      setLoading(false);
      return;
    }

    setSession(result.session ?? null);
    setMessage(result.message);
    setLoading(false);
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("zaffa.session");
      window.localStorage.removeItem("zaffa.otp");
    }
    setSession(null);
    setOtpSent(false);
    setOtp("");
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
          {isAdmin ? "You can now access the admin dashboard and manage operations." : "Your account is ready. Continue to your personal dashboard and start planning."}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/${locale}/dashboard`}>Open dashboard</Link>
          </Button>
          {isAdmin ? (
            <Button asChild>
              <Link href={`/${locale}/admin`}>Open admin</Link>
            </Button>
          ) : null}
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
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
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">• Secure account creation with phone OTP</div>
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">• Tailored experience for couples, planners, and service providers</div>
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-4 text-sm text-on-surface-variant">• Premium dashboard for plans, vendors, and bookings</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Access your account</p>
              <h2 className="font-display text-title-lg font-semibold text-on-background">Sign in with OTP</h2>
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
                setMessage("Choose your path and continue with a secure sign-in flow.");
                setOtpSent(false);
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${mode === "signup" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              onClick={() => {
                setMode("signup");
                setMessage("Create a beautiful account and receive an OTP to your phone.");
                setOtpSent(false);
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
            <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/60 bg-background/70 px-4 py-3 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
          </div>

          {otpSent && (
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-2xl border border-outline-variant/60 bg-background/70 px-4 py-3 text-sm outline-none"
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
              />
            </div>
          )}

          {message ? <p className="mt-4 text-sm text-on-surface-variant">{message}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {!otpSent ? (
              <Button onClick={handleRequestOtp} disabled={loading}>
                {loading ? "Working..." : mode === "signup" ? "Create account" : "Request OTP"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Checking..." : "Verify OTP"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" onClick={() => setOtpSent(false)}>
              <UserPlus className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
