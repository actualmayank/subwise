# Subwise

Subwise is a subscription management SaaS: track recurring subscriptions, see your monthly/annual
spend, get renewal reminders, and surface rule-based insights about your spending.

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Database:** PostgreSQL
- **ORM:** Prisma 7 (with the `@prisma/adapter-pg` driver adapter)
- **Auth:** Auth.js / NextAuth v5, credentials provider (email + password, bcrypt), JWT sessions in
  an httpOnly cookie
- **Styling/UI:** Tailwind CSS v4 + shadcn/ui (built on Base UI)
- **Charts:** Recharts
- **Validation:** Zod
- **Route protection:** a Next.js `proxy.ts` (the successor to `middleware.ts` in Next 16)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Postgres

Point `DATABASE_URL` at any Postgres instance — a local install, Docker, or a managed provider like
[Neon](https://neon.tech) or [Supabase](https://supabase.com).

Copy the example env file and fill it in:

```bash
cp .env.example .env
```

```
DATABASE_URL="postgresql://user:password@localhost:5432/subwise?schema=public"
AUTH_SECRET="generate one with: npx auth secret"
```

If you don't have Postgres installed locally, `npx prisma dev` will spin up a throwaway local
Postgres server for development (no Docker required) and print a `DATABASE_URL` to use.

### 3. Run migrations

```bash
npx prisma migrate deploy   # applies the committed migration
npx prisma generate         # regenerates the client (also runs automatically on install)
```

Use `npx prisma migrate dev` instead if you want to iterate on the schema locally.

### 4. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000), sign up, and start adding subscriptions.

### Other scripts

```bash
npm run build     # production build
npm run start     # run the production build
npm run lint       # eslint
npx tsc --noEmit  # type-check
```

## Deployment

Subwise is a single deployable Next.js app. The intended target is **Vercel** for the app and
**Neon** or **Supabase** for managed Postgres — set `DATABASE_URL` and `AUTH_SECRET` as environment
variables on Vercel and run `npx prisma migrate deploy` against the production database as part of
your release process. Actual deployment isn't wired up here; this is left for you to connect.

## Assumptions made

A few product decisions weren't fully specified, so reasonable defaults were chosen:

- **Currency is per-subscription, display is per-user.** Each subscription stores its own billing
  `currency`, but totals on the dashboard are a simple numeric sum formatted using the user's
  `currencyPreference` — there's no FX conversion. If you mix currencies, treat the totals as
  approximate.
- **"Unused" threshold:** a subscription is flagged as possibly unused in Insights if `lastUsed` is
  more than 45 days old (or was never set and the subscription is more than 45 days old).
- **Price-increase detection:** the schema doesn't store historical prices, so instead of detecting
  actual price increases, Insights compares this month's vs. last month's spend per category
  (derived from subscription `startDate`s) and flags categories trending up.
- **Spend trend chart:** the 6-month trend is derived from which subscriptions were already active
  (by `startDate`) in each of the past 6 months — no manual monthly history entry is required, per
  the spec.
- **Auth:** email/password only, single-user accounts, JWT sessions. No email verification or
  password reset flow (out of scope for v1).
- **Renewal reminder banner:** shown in-app for any subscription renewing within 3 days, on every
  page inside the authenticated app shell.

## Non-goals (v1)

- No real payment processing / Stripe integration
- No email notifications — in-app only
- No multi-user teams/org accounts
