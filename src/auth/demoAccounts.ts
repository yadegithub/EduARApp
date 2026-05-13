import type { AuthUser } from "./auth-context";

interface DemoAccount extends AuthUser {
  password: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    email: "sarah@eduar.app",
    name: "Sarah Jones",
    password: "Learn123!",
    role: "Student",
  },
];
