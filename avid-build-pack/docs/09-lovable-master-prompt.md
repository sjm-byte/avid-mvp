# 09 - Lovable Master Prompt: پرامپت ساخت MVP آوید

این متن را کامل به Lovable بده.

```text
Build a Persian RTL MVP web app for “Avid” (آوید), a project-based investment participation management platform.

Important product concept:
Avid is not a classic investment fund and not a real wallet system in the MVP. Money does NOT flow through Avid's bank account. Investors pay directly to the project executor's designated bank account or the account specified for that project. Avid records, verifies, manages, reports and calculates everything through an internal ledger.

Core business model:
- Avid lists commercial and production projects.
- Each investor must review and approve each project separately.
- Profit is not guaranteed.
- Principal is not guaranteed unless a specific project has separate legal documents.
- After project completion, actual profit/loss is calculated and distributed by ownership percentage.
- Avid earns an initial fee from the capital seeker/project executor and a success fee from realized profit if the project is profitable.
- Avid acts as the investor’s representative/agent and separately contracts with the capital seeker/project executor.

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Persian RTL UI

User roles:
1. Guest
2. Investor
3. Admin
4. Finance Manager (can be optional in MVP)

Main modules:

1. Public website
- Landing page
- About Avid
- Projects list
- Project detail page
- Transparency/performance page
- FAQ
- Risk disclosure page
- Contact page

2. Project detail page
Show:
- Project title
- Status
- Short and full description
- Category/type
- Funding target
- Minimum investment
- Funding progress
- Expected duration
- Expected return scenarios (min/base/max)
- Clear disclaimer that returns are not guaranteed
- Qualitative risk descriptions
- Risk mitigation plan
- Timeline/milestones
- Documents
- Updates
- CTA: submit investment request

3. Investor dashboard
Show:
- Total verified investment
- Active capital
- Realized profit/loss
- Pending settlement
- My projects
- My investment details per project
- My ledger entries
- My receipts
- My documents/contracts
- Notifications

4. Investment request flow
- Investor selects a project
- Enters requested amount
- Accepts risk disclosure
- Accepts project contract/terms
- Submits investment request
- Admin reviews request
- Admin approves/rejects
- If approved, payment instructions are shown
- Investor uploads receipt
- Admin verifies/rejects receipt
- After verification, investment record and ledger entries are created

5. Admin dashboard
Show:
- Total verified capital
- Active capital
- Active projects
- Active investors
- Pending investment requests
- Pending receipts
- Projects with delay
- Pending settlements
- Avid initial fees
- Avid success fees

6. Admin project management
- Create/edit projects
- Publish/unpublish projects
- Set project status
- Set funding limits
- Set expected return scenarios
- Add qualitative risks and mitigations
- Add payment instructions and destination bank account info
- Add milestones
- Upload documents
- Add project updates/reports

7. Ledger system
Every financial event should become a ledger entry:
- investment_commitment
- payment_receipt_uploaded
- payment_verified
- capital_allocated
- project_cost_recorded
- project_revenue_recorded
- initial_fee_recorded
- success_fee_recorded
- profit_calculated
- loss_calculated
- settlement_due
- settlement_paid
- adjustment

Important: Ledger is not a real wallet. It is an accounting and transparency record.

8. Settlement module
- Admin records final revenue and costs of a project
- Admin records Avid initial fee and success fee
- System calculates each investor's ownership percentage
- System calculates investor profit/loss
- System creates settlement records
- Admin can mark settlement as paid manually with tracking number

9. Transparency page
For closed projects show:
- Project title
- Expected return
- Actual return
- Expected duration
- Actual duration
- Reason for difference
- Final status
- Final report

UI style:
- Serious, trustworthy, clean financial dashboard
- Persian RTL
- Avoid hype, avoid salesy language
- Always show risk disclaimers near expected returns
- Use cards, tables, status badges, timelines and clean dashboards

Do NOT implement:
- Real payment gateway
- Real wallet
- Bank integration
- Digital signature
- Secondary market
- Investor voting
- Mobile app

Seed data:
Create 3 sample projects:
1. Import of food raw materials - medium risk - 4 months - base expected return 18%
2. Working capital for clothing production - medium/high risk - 6 months - base expected return 24%
3. Industrial equipment trading - high risk - 3 months - base expected return 30%

Create sample investors and sample ledger entries so the dashboards are not empty.

Acceptance criteria:
- A guest can view projects.
- An investor can register, view projects, accept risk and submit investment request.
- Admin can approve request and send payment instructions.
- Investor can upload receipt.
- Admin can verify receipt and create investment + ledger entries.
- Investor can see where their money is allocated.
- Admin can create project update.
- Investor can see project update.
- Admin can close project, calculate settlement and mark settlement as paid.
- Transparency page shows closed projects with expected vs actual results.
```
