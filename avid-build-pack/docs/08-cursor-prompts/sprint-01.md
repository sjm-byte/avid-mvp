# Sprint 01 Prompt - Project Setup, Auth, Layout

## هدف

اسکلت فنی MVP آوید را بساز: Next.js + TypeScript + Tailwind + shadcn/ui + Supabase Auth + فارسی RTL + Layoutهای عمومی و پنل.

## Prompt برای Cursor

```text
You are building the Avid MVP.
Read docs/01-product-prd.md, docs/02-business-rules.md, docs/03-database-schema.md, docs/05-ui-spec.md and .cursor/rules/avid-product-rules.mdc before coding.

Implement Sprint 1 only.

Requirements:
1. Set up a Next.js App Router TypeScript project.
2. Configure Tailwind CSS and shadcn/ui.
3. Configure Persian RTL globally.
4. Add Supabase client setup for browser and server.
5. Create basic auth pages:
   - /login
   - /signup
6. Create public layout:
   - Header with logo, Projects, Transparency, About, FAQ, Login
   - Footer with risk disclaimer
7. Create app dashboard layout:
   - /dashboard
   - Sidebar in Persian RTL
8. Create admin layout:
   - /admin
   - Sidebar in Persian RTL
9. Add role-aware navigation but keep authorization simple for now.
10. Create empty dashboard pages with placeholder cards.

Do not implement investment logic yet.
Do not implement wallet or payment gateway.
Do not create fake real-money flow.

Use clean, serious, financial UI.
All visible text must be Persian.
```

## معیار پذیرش

- پروژه اجرا شود.
- صفحات login/signup وجود داشته باشند.
- UI راست‌به‌چپ باشد.
- داشبورد سرمایه‌گذار و ادمین ساخته شده باشد.
- هنوز هیچ منطق سرمایه‌گذاری پیاده نشده باشد.
