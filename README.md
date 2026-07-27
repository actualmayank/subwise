# Subwise

Subwise is a subscription management SaaS — track recurring subscriptions, see your monthly/annual spend, get renewal reminders, and surface rule-based insights about your spending.

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Database:** PostgreSQL + Prisma 7
- **Auth:** Auth.js / NextAuth v5 (credentials + JWT sessions)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Charts:** Recharts
- **Validation:** Zod

## Getting started

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` to a Postgres instance ([Neon](https://neon.tech) or [Supabase](https://supabase.com) work great), then:

```bash
npm run dev
```

Open `http://localhost:3000`

## License

MIT
