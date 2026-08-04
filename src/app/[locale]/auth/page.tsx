import { AdminAuthCard } from "@/components/auth/admin-auth-card";

export default function AuthPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-margin-mobile py-16 md:px-margin-desktop">
      <div className="w-full max-w-2xl">
        <AdminAuthCard />
      </div>
    </div>
  );
}
