import { demoAccounts } from "./demoAccounts";
import type { AuthUser } from "./auth-context";

const REGISTERED_ACCOUNTS_KEY = "arlearn.accounts";

export interface StoredAccount extends AuthUser {
  password: string;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readRegisteredAccounts = (): StoredAccount[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(REGISTERED_ACCOUNTS_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as StoredAccount[];
  } catch {
    return [];
  }
};

const writeRegisteredAccounts = (accounts: StoredAccount[]) => {
  window.localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const getAllAccounts = (): StoredAccount[] => [
  ...demoAccounts,
  ...readRegisteredAccounts(),
];

export const findAccountByEmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  return getAllAccounts().find(
    (account) => normalizeEmail(account.email) === normalizedEmail,
  );
};

export const createRegisteredAccount = (account: StoredAccount) => {
  const normalizedEmail = normalizeEmail(account.email);

  if (findAccountByEmail(normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const nextAccounts = [
    ...readRegisteredAccounts(),
    {
      ...account,
      email: normalizedEmail,
    },
  ];

  writeRegisteredAccounts(nextAccounts);

  return {
    email: normalizedEmail,
    name: account.name,
    role: account.role,
  };
};
