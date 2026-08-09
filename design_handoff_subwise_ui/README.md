# Handoff: Subwise UI redesign

## Overview

A full redesign of Subwise — a subscription-tracking SaaS — covering every screen in the web
app: landing, log in, sign up, onboarding / empty state, dashboard with spend analytics,
subscriptions list, insights, settings, and the add/edit subscription dialog.

## About the design files

`Subwise.dc.html` in this folder is a **design reference created in HTML** — an interactive
prototype showing intended look and behaviour. It is not production code to copy. The task is
to recreate it inside the existing Subwise codebase (Next.js 16 App Router, TypeScript,
Tailwind v4, shadcn/ui on Base UI, Recharts, Prisma 7, Auth.js v5) using that project's
established patterns.

`styles.css` is the Nocturne design system stylesheet the prototype consumes. Port its
`:root` variables into `app/globals.css`; do not link the file into the app.

## Fidelity

**High-fidelity.** Colors, type, spacing, radii and interactions are final. Recreate the UI
pixel-perfectly using the codebase's existing component library.

---

## Design tokens

### Color — dark (default)

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#161826` | page ground |
| `--color-surface` | `#232532` | cards, sidebar, inputs, dialog |
| `--color-text` | `#e9e9ed` | body text |
| `--color-accent` | `#9184d9` | accent line, glow, outlined buttons, active nav |
| `--color-divider` | `color-mix(in srgb, #e9e9ed 16%, transparent)` | rules, borders |
| `--color-section` | `#262a60` | the one saturated ground (landing stat band, insights hero, auth panel) |
| `--tag-bg` / `--tag-fg` | `#423a6a` / `#f5f4ff` | category chips |
| `--grid` | `rgba(233,233,237,.09)` | empty bar-track |
| `--warn` / `--danger` / `--good` | `#e0b184` / `#e08a8a` / `#8fd3b6` | status only |

Accent ramp (used for hovers, pressed states, chips):
`100 #f5f4ff · 200 #e7e5fe · 300 #d2cefd · 400 #b5abfc · 500 #968ae0 · 600 #796cbf · 700 #5d5294 · 800 #423a6a · 900 #2b2741`

Neutral ramp:
`100 #f3f5fe · 200 #e4e7f5 · 300 #cfd3e5 · 400 #b2b6ca · 500 #9397ab · 600 #75798c · 700 #595d6c · 800 #3f424d · 900 #292b31`

### Color — light

`--color-bg #f4f4f9` · `--color-surface #ffffff` · `--color-text #1b1d2b` ·
`--color-accent #6a5cc4` · `--color-divider color-mix(in srgb,#1b1d2b 13%,transparent)` ·
`--tag-bg #e7e5fe` · `--tag-fg #5d5294` · `--grid rgba(27,29,43,.10)` ·
`--warn #9a6a2e` · `--danger #a24a4a` · `--good #2f7f60`

### Category colors (charts, tiles, legends)

`streaming #b5abfc` · `software #968ae0` · `fitness #796cbf` · `utilities #a7a1db` · `other #75798c`

A deliberately mono purple family — no rainbow categorical palette.

### Elevation

- `--shadow-sm: 0 0 0 1px #3f424d` — every card. On a dark ground elevation is an edge, not a blur.
- `--shadow-md: 0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,.55)` — hover lift, top bar.
- `--shadow-lg: 0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,.65)` — dialog only.
- Light theme: `sm 0 0 0 1px #e4e7f5` · `md 0 0 0 1px #e4e7f5, 0 6px 18px rgba(30,32,50,.08)` · `lg 0 0 0 1px #cfd3e5, 0 16px 40px rgba(30,32,50,.16)`

### Spacing (density 0.7×)

`2.8 · 5.6 · 8.4 · 11.2 · 16.8 · 22.4` px. Card padding 14–18px, page padding 22px/26px,
grid gaps 12px, content max-width 1180px.

### Radius

`sm 4px · md 8px · lg 14px`. Cards 10px, chips/badges 5–8px, logo tiles 7–8px, dialog 14px,
avatar tile 8px, pills 999px.

### Typography

Inter throughout (`400/500/600`). Headings at weight **500** — never bolder; hierarchy is size
and space, not weight.

| Role | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Landing h1 | 60px / 1.02 | 500 | -0.03em |
| Auth panel h2 | 38px / 1.08 | 500 | -0.03em |
| Hero metric | 40–44px / 1 | 500 | -0.03em |
| Page title | 25px | 500 | -0.025em |
| Stat value | 28px | 500 | -0.025em |
| Card / dialog title | 17–19px | 500 | -0.02em |
| Body | 13.5–14px / 1.55 | 400 | — |
| Table cell | 13.5px | 400/500 | — |
| Section kicker | 11px uppercase | 500 | 0.07em |
| Meta / caption | 11–12.5px | 400 | — |

All monetary values use `font-variant-numeric: tabular-nums`.

### Interaction states

- Focus: `outline: 2px solid var(--color-accent); outline-offset: 2px` — everywhere, never the browser default.
- Primary button: accent text + 1px accent border on transparent. Hover `accent 12%`, active `accent 22%`.
- Secondary button: divider border. Hover `text 7%`, active `text 14%`.
- Row hover: `--raise` (`rgba(255,255,255,.04)` dark, `rgba(20,22,40,.03)` light).
- Card lift: `translateY(-2px)` + `--shadow-md`, 180ms ease.
- Screen enter: `translateY(6px) → 0`, opacity 0→1, 280ms `cubic-bezier(.2,.7,.3,1)`.
- Dialog: backdrop `rgba(10,11,20,.62)` fade 160ms; panel `translateY(10px) scale(.985) → none`, 220ms.
- Toast: bottom-right, surface + `shadow-md`, auto-dismiss 2200ms.

---

## Screens

### 1. Landing

Header (brand, 3 text links, "Log in" secondary + "Start free" primary). Hero is a 2-column
grid `1fr / 440px`, 56px gap, 64px top padding: left is a pill badge ("NOW WITH RENEWAL
RADAR", accent text, 1px divider border, 999px), 60px headline capped at 12ch, 17px lede at
46ch, two buttons, a 12.5px reassurance line. Right is a surface card (14px radius,
`shadow-md`, 18px padding) showing "THIS MONTH" kicker, `+4.2% vs last` in accent, the
monthly total at 44px, a divider, then 4 renewal rows.

Below: a **full-bleed band on `--color-section`** — the only large saturated field in the
system — with 4 stats in a 4-column grid, value 34px / label 12px at 62% opacity.

Then 3 feature cards (`auto` 3-col grid, 18px gap): Phosphor icon in accent, 17px title,
13.5px body. Footer: 12px muted line + a theme switch.

### 2. Log in / Sign up

Split screen, `1.05fr / 1fr`. Left panel: `linear-gradient(160deg, var(--color-section) 0%,
var(--color-bg) 88%)`, brand top-left, a 38px headline mid-panel, lede, three inline stats
(`$248/mo` avg tracked spend · `$41/mo` found unused · `2 min` setup), a security line at the
bottom. Right panel: centred 352px form — 27px title, 13.5px sub, label (12px, 70% text) over
36px-min input, error line in `--danger` with a `warning-circle` icon, full-width primary
button, "OR" divider, Google button (secondary), swap link.

Sign up adds a "Full name" field first and lands the user on the **empty state**, not the
populated dashboard.

Validation: empty email or password → `"Email and password are required."`

### 3. Onboarding / empty state

Shown whenever the account has zero subscriptions. Left-aligned, 620px, 56px top margin.
32px headline "Let's find your recurring spend.", 15px sub, then 3 numbered step cards
(26px numbered tile in `--tag-bg`, 15px title, 13px body), then "Add your first subscription"
(primary) and "Load demo data" (secondary).

### 4. App shell

**Sidebar (default):** 216px, surface background, 1px right divider, sticky full height.
Brand, 4 nav buttons (8px radius, 16px Phosphor icon, 13.5px/500 label, right-aligned count
in 11px muted), active = `accent 14%` fill + `accent 45%` border + accent text. Below the
nav, a primary "Add subscription" button. Bottom: user block — 30px `--tag-bg` initials tile,
name 12.5px/500, email 11px muted, sign-out icon button — above a divider.

**Top bar (alternative):** same items laid horizontally in a sticky 10px/22px surface header,
"Add" primary pushed right, initials tile at the far right.

**Renewal banner:** below the header when anything renews within 7 days —
`accent 13%` background, `bell-ringing` fill icon, "N subscriptions renew within 7 days —
$X total.", a ghost "Review" link, dismiss ✕ at the right.

Nav items and icons: Dashboard `squares-four` · Subscriptions `list-checks` (count = total) ·
Insights `lightbulb` (count = flagged unused) · Settings `gear-six`.

### 5. Dashboard

Header row: title + date line ("Monday, August 9 · N renewals in the next 30 days"), a
segmented 30 days / 90 days / 12 months control, theme toggle, nav-shell toggle.

**Stat row** — 4 equal cards, 12px gap. Each: accent Phosphor icon + 11px uppercase label,
28px value, a delta line (colored `--warn` when spend rose, `--good` when it fell) plus
context, and a 7-bar 22px sparkline where the last bar is full accent and the rest are
`accent 30%`. Cards: Monthly spend (`currency-circle-dollar`), Annual run rate
(`chart-line-up`, delta = weekly equivalent), Due in 7 days (`calendar-check`, delta = amount
charging), Active subscriptions (`stack`, delta = category count).

**Charts row** — `1fr / 1.35fr`.
*Spend by category*: a 126px `conic-gradient` donut with an 88px surface hole containing the
monthly total (19px) over "per month" (10.5px); to its right a legend where each row is
`8px color square · label · % · right-aligned amount`.
*6-month spend trend*: bars in a 150px well over a bottom divider, value label above each
bar, month label below; last month full accent, earlier months `accent 38%`; header shows
`+N% over 6 months` in accent.

**Bottom row** — `1.3fr / 1fr`.
*Upcoming renewals · next 30 days*: rows of `28px striped logo tile · name + "Category ·
Mon D" meta · days badge · right-aligned amount`. Badge color: ≤3d `--danger` at 22%,
≤10d `--warn` at 20%, else `--grid`.
*Biggest line items*: 6 ranked rows, each a name / amount / % line above a 5px progress bar
in the category color on a `--grid` track.

### 6. Subscriptions

Header: title, summary line "16 active · $348/mo · $4,176/yr", a Table/Cards segmented
control, primary "Add subscription".

Filter row: 300px search input with a `magnifying-glass` icon at 9px left, then category
chips (All + 5 categories) each with a muted count; active chip = accent border + `accent
14%` fill + accent text. Right side: "N of M shown".

**Table view** — surface card, 10px radius, `shadow-sm`, overflow hidden. Header cells 10.5px
uppercase, 0.08em tracking, clickable, active sort marked with an accent ↑/↓. Columns:
Service (28px striped logo tile + name/500 over 11px notes) · Category (chip) · Monthly
(right, 500) · Annual (right, muted) · Cycle (capitalised, muted) · Next renewal (date +
days badge) · Last used ("Nd ago", `--warn` past 45 days) · Actions (pencil, trash in
`--danger`). Rows separated by 1px divider, hover `--raise`. Empty result: "Nothing matches
that filter." centred at 44px padding.

**Card view** — `repeat(auto-fill, minmax(238px, 1fr))`, 12px gap. Each card: 34px logo tile
+ name + "Category · cycle", 24px monthly figure with "/mo · $X/yr" beside it, divider, then
a calendar icon + renewal date with the days badge pushed right.

Logo tiles are **placeholders**: `repeating-linear-gradient(135deg, <category color> 0 3px,
transparent 3px 6px)` with a 1px inset divider ring and the service's first letter centred at
600 weight. Swap in real service logos when you have them.

### 7. Insights

Title block, then a **hero band** on `linear-gradient(135deg, var(--color-section), 55% mix
with bg)`, 12px radius, 22px padding: "POTENTIAL MONTHLY SAVINGS" kicker over a 40px figure
and a 12.5px annualised line, a vertical rule, then three stats (Most expensive · Top
category · Flagged unused), each kicker / 20px value / 12px sub.

Two cards below (`1fr / 1fr`): *Suggestions* (`lightbulb` accent icon) — rule-generated
sentences as 13.5px rows with a 5px accent dot; *Possibly unused* (`warning-circle` in
`--warn`) — rows of logo tile, name, "Last used N days ago", monthly amount, and a secondary
"Used" button that resets `lastUsed` and fires a toast.

Full-width card: *Category spend, month over month* — color square, 96px label, a flexible
6px bar on `--grid`, right-aligned amount, and a % delta colored `--warn` up / `--good` down.

Rules as implemented in `lib/insights.ts`: unused = `lastUsed` older than 45 days; savings =
sum of monthly cost of unused; suggestions cover unused count/savings, the largest line item
with an annual-plan hint, the dominant category share, and next-7-day renewal load.

### 8. Settings (max 640px)

*Profile* card: Name / Email in a 2-col grid, then Display currency (USD/EUR/GBP/INR) and
Billing month start, then an Appearance segmented control (Dark `moon` / Light `sun`).

*Alerts* card: three toggle rows — Renewal reminders, Unused subscription alerts, Weekly
spend digest — each with a 13.5px label over 12px description and a 38×22px pill switch
(knob 16px, `left` 2px→18px, 160ms; on = `accent 45%` track, accent border, `accent-200` knob).

*Danger zone*: surface card with a `danger 40%` ring instead of the normal edge, a
description naming the subscription count, and a `--danger` outlined "Delete account" button.

### 9. Add / Edit subscription dialog

560px max, surface, 14px radius, `shadow-lg`, 20px padding. Title row with an ✕. Fields:
Service name + Category (`1.4fr / 1fr`); Cost + Currency + Billing cycle (3 equal); Next
renewal + Last used (dates, 2 equal); Notes (full width). Below the fields, a live
normalisation strip on `--raise` with a `calculator` accent icon: *"Normalises to $X per
month · $Y per year"*, recomputed on every keystroke. Errors in `--danger` above the actions.
Actions right-aligned: Cancel (secondary), "Add subscription" / "Save changes" (primary).

Validation: name required → `"Give the subscription a name."`; cost must be > 0 →
`"Enter a cost greater than zero."` Success fires a toast ("Netflix added" / "Netflix
updated"). Cycle→monthly conversion: weekly `12/52`, monthly `1`, quarterly `3`, yearly `12`.

---

## State

Prototype state, and where each piece belongs in the app:

| State | Home in the app |
| --- | --- |
| `screen` | Next.js routing (`/`, `/login`, `/signup`, `/dashboard`, `/subscriptions`, `/insights`, `/settings`) |
| `subs` | Prisma `Subscription` rows via server components / actions |
| `theme` | new `User.theme` column; applied on `<html>` |
| `shell` (sidebar/topbar) | user preference or a constant — your call |
| `view` (table/cards) | client state on the subscriptions page, persist in `localStorage` |
| `query`, `cat`, `sortKey`, `sortAsc` | client state in `SubscriptionsTable` (already there) |
| `modal`, `form`, `formError` | dialog state in `SubscriptionForm` (already there) |
| `bannerOpen` | client state; dismissal can be session-only |
| `alerts[3]` | new user-preference columns if you want them to persist |
| `toast` | existing `sonner` toaster |

## Assets

- **Icons:** Phosphor (`@phosphor-icons/react`) — replaces `lucide-react`. Names used:
  `arrow-right, bell-ringing, broom, calculator, calendar-blank, calendar-check, chart-donut,
  chart-line-up, check-circle, circle, currency-circle-dollar, gear-six, google-logo, layout,
  lightbulb, list-checks, magnifying-glass, moon, pencil-simple, plus, radar, rows, sign-out,
  squares-four, stack, sun, trash, warning-circle, x`
- **Fonts:** Inter (Google Fonts), weights 400/500/600.
- **Service logos:** none — striped placeholder tiles with the service initial. Replace with
  real marks (Clearbit-style logo API or bundled SVGs) before launch.
- **Photography:** none used.

## Files in this bundle

- `Subwise.dc.html` — the interactive prototype (open in a browser; all screens reachable).
- `styles.css` — Nocturne design-system stylesheet, source of every token above.
- `PROMPT.md` — a ready-to-paste Claude Code prompt for implementing this.
- `README.md` — this document.
