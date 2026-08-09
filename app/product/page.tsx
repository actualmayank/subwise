import Link from "next/link";
import {
  Broom,
  CalendarCheck,
  ChartDonut,
  MagnifyingGlass,
  Target,
} from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing-header";
import { SiteFooter } from "@/components/site-footer";

const CAPABILITIES = [
  {
    icon: Target,
    title: "Renewal radar",
    body: "Every charge in the next 30 days, sorted by how soon it hits, with the amount attached. Nothing renews as a surprise again.",
  },
  {
    icon: ChartDonut,
    title: "Spend, broken down",
    body: "Category splits, a six-month trend, and the biggest line items, all normalised to a single monthly number so mixed billing cycles are easy to compare.",
  },
  {
    icon: Broom,
    title: "Unused detection",
    body: "Anything you haven't touched in 45 days gets flagged automatically, with the exact monthly and annual amount you'd save by cancelling it.",
  },
];

const STEPS = [
  {
    icon: MagnifyingGlass,
    title: "Add what you pay for",
    body: "Enter a subscription's cost, billing cycle, and renewal date, takes about two minutes for a typical list.",
  },
  {
    icon: CalendarCheck,
    title: "Subwise tracks the rest",
    body: "Renewals, monthly totals, and category spend update automatically as dates pass and subscriptions change.",
  },
  {
    icon: Broom,
    title: "Cut what you don't use",
    body: "Check Insights when you want a second opinion, it flags stale subscriptions and totals up what cancelling them would save.",
  },
];

export default function ProductPage() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-6">
        <section className="pt-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] font-medium tracking-[0.07em] text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" />
            Product
          </span>
          <h1 className="mx-auto mt-4 max-w-[20ch] text-[48px] leading-[1.05] font-medium tracking-[-0.03em]">
            One dashboard for every subscription you pay for.
          </h1>
          <p className="mx-auto mt-4 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground">
            Subwise is where every recurring charge lives, what it costs, when it renews, and
            whether it&apos;s still worth keeping. No spreadsheet, no guessing at the end of the
            month.
          </p>
        </section>

        <section className="grid gap-[18px] py-16 sm:grid-cols-3">
          {CAPABILITIES.map((f) => (
            <div key={f.title} className="rounded-md bg-card p-[18px] shadow-sm">
              <f.icon size={24} weight="bold" className="text-primary" />
              <h3 className="mt-3 text-[17px] font-medium tracking-[-0.02em]">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-divider py-16">
          <h2 className="text-center text-[28px] font-medium tracking-[-0.025em]">
            How it works
          </h2>
          <div className="mt-10 grid gap-[18px] sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-md bg-card p-[18px] shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-tag-bg text-[12px] font-medium text-tag-fg">
                    {i + 1}
                  </span>
                  <s.icon size={20} weight="bold" className="text-primary" />
                </div>
                <h3 className="mt-3 text-[15px] font-medium tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-3 border-t border-divider py-16 text-center">
          <h2 className="text-[28px] font-medium tracking-[-0.025em]">
            See what you&apos;re actually paying for.
          </h2>
          <div className="mt-2 flex gap-3">
            <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
              Create free account
            </Button>
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              size="lg"
              variant="outline"
            >
              See the demo dashboard
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
