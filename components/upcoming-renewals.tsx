import { Badge } from "@/components/ui/badge";
import { formatCurrency, daysUntil } from "@/lib/subscription-utils";
import type { ClientSubscription } from "@/lib/types";

export function UpcomingRenewals({ subscriptions }: { subscriptions: ClientSubscription[] }) {
  if (subscriptions.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No renewals coming up.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {subscriptions.map((s) => {
        const days = daysUntil(new Date(s.nextRenewalDate));
        return (
          <li key={s.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(s.nextRenewalDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={days <= 3 ? "destructive" : "secondary"}>
                {days === 0 ? "Today" : `${days}d`}
              </Badge>
              <span className="w-16 text-right text-sm font-medium">
                {formatCurrency(s.cost, s.currency)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
