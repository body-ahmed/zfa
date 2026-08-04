export type AuthRole = "admin" | "member" | "bride" | "vendor";

export interface AuthAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: AuthRole;
  createdAt: string;
}

export interface AuthSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AuthRole;
  createdAt: string;
}

interface AuthResult {
  ok: boolean;
  message: string;
  account?: AuthAccount;
  session?: AuthSession;
  code?: string;
}

const ACCOUNTS_KEY = "zaffa.accounts";
const SESSION_KEY = "zaffa.session";
const OTP_KEY = "zaffa.otp";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function getDefaultAccounts(): AuthAccount[] {
  return [
    {
      id: "admin-1",
      name: "Admin",
      email: "admin@zaffa.com",
      password: "Admin123!",
      phone: "+966500000000",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
  ];
}

function ensureSeedAccounts() {
  const stored = readStorage<AuthAccount[]>(ACCOUNTS_KEY, []);
  if (stored.length > 0) {
    return stored;
  }

  const seed = getDefaultAccounts();
  writeStorage(ACCOUNTS_KEY, seed);
  return seed;
}

export function getStoredAccounts(): AuthAccount[] {
  return ensureSeedAccounts();
}

export function createAccount(name: string, email: string, password: string, phone: string, role: AuthRole): AuthResult {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedPhone) {
    return { ok: false, message: "Please complete all fields before creating your account." };
  }

  const accounts = getStoredAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === trimmedEmail)) {
    return { ok: false, message: "This account already exists." };
  }

  const account: AuthAccount = {
    id: `acct-${Date.now()}`,
    name: trimmedName,
    email: trimmedEmail,
    password: trimmedPassword,
    phone: trimmedPhone,
    role: role === "admin" ? "member" : role,
    createdAt: new Date().toISOString(),
  };

  const nextAccounts = [...accounts, account];
  writeStorage(ACCOUNTS_KEY, nextAccounts);

  return {
    ok: true,
    message: "Account created. We sent an OTP to your phone number.",
    account,
  };
}

export function requestOtp(email: string, password: string, phone?: string): AuthResult {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const trimmedPhone = phone?.trim();
  const accounts = getStoredAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === trimmedEmail);

  if (!account) {
    return { ok: false, message: "No account was found for this email." };
  }

  if (account.password !== trimmedPassword) {
    return { ok: false, message: "Password is incorrect." };
  }

  if (trimmedPhone && account.phone !== trimmedPhone) {
    return { ok: false, message: "The phone number does not match this account." };
  }

  const code = String(100000 + Math.floor(Math.random() * 900000));
  writeStorage(OTP_KEY, {
    email: trimmedEmail,
    phone: account.phone,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return {
    ok: true,
    message: "OTP sent to your phone. Use the code below to continue.",
    code,
    account,
  };
}

export function verifyOtp(email: string, otp: string): AuthResult {
  const trimmedEmail = email.trim().toLowerCase();
  const pending = readStorage<{ email: string; phone: string; code: string; expiresAt: number } | null>(OTP_KEY, null);

  if (!pending || pending.email !== trimmedEmail) {
    return { ok: false, message: "No OTP is pending for this email." };
  }

  if (pending.expiresAt < Date.now()) {
    return { ok: false, message: "This OTP has expired. Please request a new one." };
  }

  if (pending.code !== otp.trim()) {
    return { ok: false, message: "The OTP is incorrect." };
  }

  const accounts = getStoredAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === trimmedEmail);
  if (!account) {
    return { ok: false, message: "Account could not be loaded." };
  }

  const session: AuthSession = {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: account.role,
    createdAt: new Date().toISOString(),
  };

  writeStorage(SESSION_KEY, session);
  writeStorage(OTP_KEY, null);

  return { ok: true, message: "Signed in successfully.", session };
}

export function getStoredSession(): AuthSession | null {
  return readStorage<AuthSession | null>(SESSION_KEY, null);
}

export function clearStoredSession() {
  writeStorage(SESSION_KEY, null);
  writeStorage(OTP_KEY, null);
}
