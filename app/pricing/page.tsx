import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing-header";
import { SiteFooter } from "@/components/site-footer";

const INCLUDED = [
  "Unlimited tracked subscriptions",
  "Renewal radar and due-soon alerts",
  "Spend analytics and category breakdowns",
  "Unused-subscription detection",
];

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-[560px] flex-1 px-6 pt-20 pb-24 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] font-medium tracking-[0.07em] text-primary uppercase">
          <span className="size-1.5 rounded-full bg-primary" />
          Early access
        </span>
        <h1 className="mt-4 text-[42px] leading-[1.05] font-medium tracking-[-0.025em]">
          Free while we build.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Subwise doesn&apos;t charge for anything yet, no card, no trial countdown, no plan
          tiers. Paid plans may come later as the product grows, but every account created today
          keeps full access.
        </p>

        <ul className="mt-8 flex flex-col gap-3 rounded-md bg-card p-[18px] text-left shadow-sm">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[13.5px]">
              <CheckCircle weight="fill" className="size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center gap-3">
          <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
            Create free account
          </Button>
          <Button render={<Link href="/" />} nativeButton={false} size="lg" variant="outline">
            Back to home
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
