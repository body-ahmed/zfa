import { redirect } from "next/navigation";
import { getStoredSession } from "@/lib/auth/mock-auth";

export default function DashboardPage() {
  const session = getStoredSession();

  if (!session) {
    redirect("/en/auth");
  }

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-16 md:px-margin-desktop">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Welcome back</p>
          <h1 className="mt-3 font-display text-headline-md font-bold text-on-background">{session.name}, your wedding journey starts here.</h1>
          <p className="mt-4 max-w-2xl text-base text-on-surface-variant">
            Your account is ready. Pick your next step, explore curated vendors, and keep every detail beautifully organized.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-5">
              <h2 className="font-display text-title-lg font-semibold text-on-background">Plan your day</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Create a timeline, track your budget, and manage guest lists in one calm workspace.</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/60 bg-background/70 p-5">
              <h2 className="font-display text-title-lg font-semibold text-on-background">Discover vendors</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Browse premium photographers, floral studios, venues, and planners tailored to your style.</p>
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-outline-variant/60 bg-background/70 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your profile</p>
          <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
            <p><span className="font-semibold text-on-background">Email:</span> {session.email}</p>
            <p><span className="font-semibold text-on-background">Phone:</span> {session.phone}</p>
            <p><span className="font-semibold text-on-background">Role:</span> {session.role}</p>
          </div>
          <div className="mt-6 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 text-sm text-on-surface-variant">
            We’ll connect this area to real Supabase data in the next step so your bookings, vendors, and plans stay synced.
          </div>
        </aside>
      </div>
    </div>
  );
}
