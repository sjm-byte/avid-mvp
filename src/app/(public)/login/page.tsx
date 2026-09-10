import { AuthUnavailableNotice } from "@/components/auth/AuthUnavailableNotice";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <AuthUnavailableNotice title="ورود به‌زودی" />
    </div>
  );
}
