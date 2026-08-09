import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Broom, ChartDonut, Target } from "@phosphor-icons/react/ssr";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogoTile } from "@/components/logo-tile";
import { MarketingHeader } from "@/components/marketing-header";
import { SiteFooter } from "@/components/site-footer";

const RENEWALS = [
  { name: "Netflix", category: "streaming", date: "Aug 11", amount: "$15.49" },
  { name: "ChatGPT Plus", category: "software", date: "Aug 12", amount: "$20" },
  { name: "Spotify", category: "streaming", date: "Aug 14", amount: "$11.99" },
  { name: "Linear", category: "software", date: "Aug 15", amount: "$8" },
];

const STATS = [
  { value: "15", label: "avg subscriptions per user" },
  { value: "94%", label: "renewals caught before charge" },
  { value: "$41", label: "median monthly saving found" },
  { value: "2 min", label: "setup, start to dashboard" },
];

const FEATURES = [
  {
    icon: Target,
    title: "Renewal radar",
    body: "Every charge in the next 30 days, sorted by how soon it hits, with the amount attached.",
  },
  {
    icon: ChartDonut,
    title: "Spend, broken down",
    body: "Category splits, six-month trend and the biggest line items normalised to a monthly number.",
  },
  {
    icon: Broom,
    title: "Unused detection",
    body: "Anything you have not touched in 45 days gets flagged with the exact amount you would save.",
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-6">
        <section className="grid gap-14 pt-16 lg:grid-cols-[1fr_440px]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] font-medium tracking-[0.07em] text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              Now with renewal radar
            </span>
            <h1 className="mt-4 max-w-[12ch] text-[60px] leading-[1.02] font-medium tracking-[-0.03em]">
              Every subscription, one number.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground">
              Subwise tracks what you pay, when it renews, and what you have stopped using, so
              the total stops being a surprise at the end of the month.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
                Create free account
                <ArrowRight data-icon="inline-end" weight="bold" />
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
            <p className="mt-4 text-[12.5px] text-muted-foreground">
              No card required · Import from email or add manually
            </p>
          </div>

          <div className="h-fit rounded-[14px] bg-card p-[18px] shadow-md">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium tracking-[0.07em] text-muted-foreground uppercase">
                This month
              </span>
              <span className="text-[12px] text-primary">+4.2% vs last</span>
            </div>
            <div className="mt-2 text-[44px] leading-none font-medium tracking-[-0.03em] tabular-nums">
              $297
            </div>
            <div className="mt-4 border-t border-divider" />
            <ul className="mt-3 flex flex-col gap-3">
              {RENEWALS.map((r) => (
                <li key={r.name} className="flex items-center gap-3">
                  <LogoTile name={r.name} category={r.category} size={28} />
                  <span className="flex-1 text-[13.5px]">{r.name}</span>
                  <span className="text-[12px] text-muted-foreground">{r.date}</span>
                  <span className="w-14 text-right text-[13.5px] font-medium tabular-nums">
                    {r.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <section className="mt-20 bg-section py-10">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-2 gap-8 px-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-[34px] leading-none font-medium tracking-[-0.025em] text-white">
                {s.value}
              </div>
              <div className="mt-1 text-[12px] text-white/62">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-6">
        <section className="grid gap-[18px] py-16 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-md bg-card p-[14px] shadow-sm">
              <f.icon size={22} weight="bold" className="text-primary" />
              <h3 className="mt-3 text-[17px] font-medium tracking-[-0.02em]">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
