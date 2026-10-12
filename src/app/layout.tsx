import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Source_Sans_3, Vazirmatn } from "next/font/google";
import { LOCALE_HEADER } from "@/lib/i18n/locale";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

/** English site: classic display serif for headings and figures. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/** English site: humanist sans for body copy, tables and UI. */
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-en-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "آوید — مشارکت شفاف در پروژه‌های واقعی",
  description:
    "پلتفرم مدیریت مشارکت پروژه‌ای. پروژه‌ها را جداگانه بررسی کنید، ریسک‌ها را ببینید و وضعیت سرمایه خود را مرحله‌به‌مرحله دنبال کنید.",
  icons: {
    icon: [
      { url: "/assets/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/assets/brand/favicon-192.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isEnglish = (await headers()).get(LOCALE_HEADER) === "en";

  return (
    <html
      lang={isEnglish ? "en" : "fa"}
      dir={isEnglish ? "ltr" : "rtl"}
      className={`${vazirmatn.variable} ${cormorant.variable} ${sourceSans.variable} max-w-full overflow-x-hidden`}
    >
      <body
        className={`min-h-screen max-w-full overflow-x-hidden antialiased ${isEnglish ? "font-en" : "font-sans"}`}
      >
        {children}
      </body>
    </html>
  );
}
