import { UserProfile } from "@/types/user";

/**
 * Mock user for MVP Sprint 01 — replace with Supabase profile lookup in Sprint 02.
 */
export const MOCK_INVESTOR: UserProfile = {
  id: "mock-investor-1",
  email: "investor@example.com",
  fullName: "علی رضایی",
  role: "investor",
};

export const MOCK_ADMIN: UserProfile = {
  id: "mock-admin-1",
  email: "admin@example.com",
  fullName: "سارا محمدی",
  role: "admin",
};

export function getMockUser(role?: string | null): UserProfile | null {
  if (role === "admin") return MOCK_ADMIN;
  if (role === "investor") return MOCK_INVESTOR;
  return null;
}
