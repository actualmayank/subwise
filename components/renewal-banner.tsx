import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, daysUntil } from "@/lib/subscription-utils";
import { AlertTriangle } from "lucide-react";

export async function RenewalBanner() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const in3Days = new Date(now);
  in3Days.setDate(in3Days.getDate() + 3);

  const upcoming = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
      nextRenewalDate: { gte: now, lte: in3Days },
    },
    orderBy: { nextRenewalDate: "asc" },
  });

  if (upcoming.length === 0) return null;

  return (
    <div className="border-b border-border bg-amber-500/10 px-4 py-2.5 text-sm text-amber-400 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p>
          {upcoming.length === 1 ? (
            <>
              <strong>{upcoming[0].name}</strong> renews{" "}
              {daysUntil(upcoming[0].nextRenewalDate) === 0
                ? "today"
                : `in ${daysUntil(upcoming[0].nextRenewalDate)} day(s)`}{" "}
              for {formatCurrency(Number(upcoming[0].cost), upcoming[0].currency)}.
            </>
          ) : (
            <>
              {upcoming.length} subscriptions renew in the next 3 days:{" "}
              {upcoming.map((s: { name: string }) => s.name).join(", ")}.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
