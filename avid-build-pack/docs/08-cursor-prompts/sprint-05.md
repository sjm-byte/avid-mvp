# Sprint 05 Prompt - Project Updates and Documents

## هدف

گزارش‌دهی پروژه و مرکز اسناد پیاده شود.

## Prompt برای Cursor

```text
Implement Sprint 5 for Avid.

Build project updates and document center.

Database:
- project_updates
- project_documents
- project_milestones if not done

Admin:
1. /admin/projects/[id]/updates
   - create update
   - choose update_type: general, financial, operational, delay, risk, settlement
   - choose visibility: public, investors_only, admin_only
   - publish update
2. /admin/projects/[id]/documents
   - upload document
   - choose document_type
   - choose visibility

Investor:
1. /dashboard/projects/[id]
   - show investment amount
   - ownership percent
   - project status
   - timeline
   - updates visible to this investor
   - documents visible to this investor
   - ledger entries related to this project

Public:
- project detail page shows public updates and public documents only.

Rules:
- investors_only updates are visible only to investors with verified investment in that project.
- admin_only documents are never visible to investors.
- published updates should not be hard deleted.
```

## معیار پذیرش

- ادمین بتواند گزارش منتشر کند.
- سرمایه‌گذار همان پروژه گزارش را ببیند.
- اسناد بر اساس سطح دسترسی نمایش داده شوند.
