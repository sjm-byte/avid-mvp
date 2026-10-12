# CLAUDE.md — Avid MVP

Guidance for Claude when working in this repository.

## Project

Avid (آوید) is a Persian RTL, project-based investment participation management platform.
It is not a classic investment fund UI, not a retail shopping UI, and not a real wallet app.

Full product context lives in `avid-build-pack/docs/` (PRD, business rules, DB schema,
user flows, UI spec, API spec, development plan). Read the relevant doc before building a feature.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 3 + shadcn-style components (`src/components/ui`)
- Supabase (`@supabase/ssr`); without Supabase env vars the app runs in demo mode (cookie-based mock login)
- Route groups: `src/app/(public)`, `(dashboard)`, `(admin)`, plus `src/app/api`

## English site

- The public site is bilingual: Persian at `/…`, English at `/en/…` (`src/app/en`, `src/components/en`).
- `<html lang dir>` is set per request from the `x-avid-locale` header added in `src/middleware.ts`.
- Switching language is always a full page load (`LanguageSwitch`, plain `<a>`), never `next/link`.
- English typography: Cormorant Garamond (`font-display`, headings and figures) + Source Sans 3 (`font-en`, body/UI). Tokens live under `.en-site` in `globals.css`.
- When Persian public content changes, update the English page too. Shared data (projects, settlement table) is translated via `src/lib/i18n/en-projects.ts`; dates are shown in Gregorian (`src/lib/i18n/dates.ts`).

## Workflow and deployment

- Commit and push directly to `main`.
- ParsPack auto-deploys every push to `main` to the live site (https://avidinvest.ir).
  So every push is a production release.
- Before every push, run `npm run build` and make sure it succeeds. Never push a broken build.
  If npm is unreachable from the dev environment, push to a `claude/*` branch first: the
  `preview` GitHub workflow builds it, takes screenshots of key pages (desktop + mobile) and
  publishes them with the build log to the `ci-results/<branch>` branch. Merge to `main` only after it passes.
- Never commit secrets or `.env*` files. Env vars are set in the ParsPack panel (see `DEPLOYMENT.md`).

## Critical financial rule

Money does not flow through Avid in the MVP.
Do not implement real wallet, payment gateway, bank integration, balance top-up or withdrawal.
Use these concepts instead:

- investment request
- payment instructions
- receipt upload
- admin verification
- investment allocation
- ledger entry
- settlement record

## Language

All user-facing text must be Persian and RTL.
Use a serious, transparent, financial tone. Avoid hype.

## Risk language

Never write:

- سود تضمینی
- بدون ریسک
- سود قطعی
- اصل سرمایه محفوظ
- درآمد ثابت

Unless explicitly attached to a project-specific legal document, which is not part of MVP.

Always show a disclaimer near expected returns:

«این عدد پیش‌بینی است و سود قطعی یا تضمینی محسوب نمی‌شود.»

## Ledger rule

Ledger is the financial source of truth.
Do not allow hard delete for posted ledger entries.
Use adjustment entries for corrections.

## Authorization rule

Investors can only see their own:

- investment requests
- receipts
- investments
- settlements
- ledger entries
- project updates for projects they invested in

Admins can see all.

## UI rule

The product should feel like a modern private investment office:

- clean dashboard
- neutral cards
- clear tables
- status badges
- timelines
- no flashy sales design

## Development rule

Work Sprint by Sprint.
Do not implement future modules unless requested.
Do not add payment gateway or wallet even if a component library suggests it.
