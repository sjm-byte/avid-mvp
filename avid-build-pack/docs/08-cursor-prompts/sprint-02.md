# Sprint 02 Prompt - Public Website and Projects

## هدف

ویترین عمومی، لیست پروژه‌ها و صفحه جزئیات پروژه ساخته شود.

## Prompt برای Cursor

```text
Implement Sprint 2 for Avid.

Read the PRD, UI spec and database schema first.

Build:
1. Home page /
2. Projects listing page /projects
3. Project detail page /projects/[slug]
4. Transparency page /transparency with placeholder closed projects
5. FAQ page /faq
6. Risk disclosure page /risk-disclosure

Create components:
- ProjectCard
- ProjectStatusBadge
- FundingProgressBar
- ReturnScenarioCard
- RiskDisclosureBox
- ProjectTimeline
- DocumentList

Use seed data if Supabase is not fully connected yet, but structure code so it can later read from Supabase.

Project detail page must include:
- title
- status
- description
- funding target
- funding progress
- minimum investment
- expected duration
- expected return min/base/max
- clear disclaimer: سود پیش‌بینی‌شده تضمینی نیست
- qualitative risk list
- mitigation plan
- milestones
- documents placeholder
- CTA button: درخواست مشارکت

Do not implement request submission yet; CTA can redirect to login or open a placeholder modal.
Do not implement payment gateway or wallet.
```

## معیار پذیرش

- بازدیدکننده بتواند پروژه‌ها را ببیند.
- صفحه پروژه حس شفاف و جدی داشته باشد.
- سود پیش‌بینی‌شده کنار هشدار ریسک نمایش داده شود.
