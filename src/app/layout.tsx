import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "آوید — مشارکت شفاف در پروژه‌های واقعی",
  description:
    "پلتفرم مدیریت مشارکت پروژه‌ای. پروژه‌ها را جداگانه بررسی کنید، ریسک‌ها را ببینید و وضعیت سرمایه خود را مرحله‌به‌مرحله دنبال کنید.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} max-w-full overflow-x-hidden`}
    >
      <body className="min-h-screen max-w-full overflow-x-hidden font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
