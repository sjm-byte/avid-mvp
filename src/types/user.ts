export type UserRole = "investor" | "admin" | "finance";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  investor: "سرمایه‌گذار",
  admin: "مدیرعامل",
  finance: "مدیر مالی",
};
