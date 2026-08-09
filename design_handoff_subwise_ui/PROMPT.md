# Paste this into Claude Code

> Working directory: the existing Subwise Next.js repo. Read `README.md`, `AGENTS.md`,
> `app/globals.css`, and `design_handoff_subwise_ui/README.md` before writing any code.

---

I'm redesigning the Subwise UI. `design_handoff_subwise_ui/Subwise.dc.html` is a working
HTML prototype of the new design — open it in a browser and use it as the visual and
behavioural source of truth. It is a **reference**, not code to copy: reimplement it in this
repo's stack (Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui on Base UI, Recharts,
Prisma, Auth.js) using the patterns already in `components/` and `lib/`.

## What to change

Retheme the app to the **Nocturne** design system and rebuild all screens against it.
Full token table and per-screen specs are in `design_handoff_subwise_ui/README.md`.

1. **Tokens.** Replace the dark/light blocks in `app/globals.css` with the Nocturne values in
   the handoff README. Key moves: ground `#161826`, surface `#232532`, text `#e9e9ed`, accent
   `#9184d9` (light-mode accent `#6a5cc4`), radius 8px, density 0.7× spacing, Inter as both
   heading and body font (replace Geist). Add a light theme — the app is currently
   hard-coded `dark` on `<html>` in `app/layout.tsx`; make it a user preference persisted on
   the `User` record and applied via a `data-theme`/`class` attribute.
2. **Primary buttons are outlined, not filled** — 1px accent border on transparent, accent
   text. Update the shadcn `Button` variants accordingly.
3. **Icons: swap `lucide-react` for `@phosphor-icons/react`.** Icon names used in the
   prototype are listed per-screen in the handoff README.
4. **Rebuild each screen** to match the prototype: Landing, Login, Sign up, Onboarding /
   empty state, Dashboard, Subscriptions (table **and** card view, user-switchable),
   Insights, Settings, and the Add/Edit subscription dialog.
5. **New nav shell option.** Keep the sidebar as default but extract nav into a shell
   component that can also render as a top bar (prototype toggles between them).
6. **Charts.** The prototype draws the donut with `conic-gradient` and the trend as CSS bars.
   In the app, implement them with Recharts (`PieChart` with `innerRadius`, `BarChart`) using
   the Nocturne category colors, keeping the same information: centre label showing the
   monthly total, legend rows with category / % / amount, and last-month bar in full accent
   with prior months at 38% accent.

## Data & behaviour

Everything the prototype computes already exists server-side — reuse
`lib/subscription-utils.ts`, `lib/dashboard-data.ts` and `lib/insights.ts` rather than
recomputing on the client. Two additions:

- Subscriptions table gains **Annual** and **Last used** columns; "last used" over 45 days
  renders in the warning color.
- Category filter is a row of chips with per-category counts (replaces the current
  `Select`), sitting next to the search input; sorting stays client-side on the table.

## Constraints

- No new dependencies beyond `@phosphor-icons/react`. Do not add a CSS-in-JS library.
- Keep all existing server actions, Zod schemas and Prisma queries working; this is a UI
  change plus a `theme` column on `User`. Write the migration.
- Preserve accessibility: `:focus-visible` is a 2px accent outline with 2px offset
  everywhere — never the browser default.
- Do not hard-code hex values in components. Everything reads from the CSS variables.

## Order of work

1. Tokens + fonts + theme switching (`globals.css`, `app/layout.tsx`, `User.theme` migration).
2. shadcn primitive updates (button, input, card, table, badge, dialog, select).
3. App shell (sidebar/top bar, renewal banner, user block).
4. Dashboard → Subscriptions → Insights → Settings → auth screens → landing.
5. `npx tsc --noEmit` and `npm run lint` must pass before you call it done.

After each screen, show me a screenshot and stop for review before moving to the next.
