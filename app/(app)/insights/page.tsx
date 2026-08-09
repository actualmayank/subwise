import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getInsights } from "@/lib/insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, toMonthlyCost, CATEGORY_LABELS } from "@/lib/subscription-utils";
import { Lightbulb, TrendingUp, AlertCircle, Crown, PiggyBank } from "lucide-react";
import { MarkUsedButton } from "@/components/mark-used-button";

export default async function InsightsPage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session!.user.id } });
  const currency = user.currencyPreference;
  const {
    subscriptions,
    unused,
    potentialMonthlySavings,
    mostExpensive,
    topCategory,
    categoryDeltas,
    suggestions,
  } = await getInsights(user.id);

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">No insights yet</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add a few subscriptions and check back, we&apos;ll surface spending patterns and
          suggestions here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Rule-based analysis of your subscription spending.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <PiggyBank className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potential monthly savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {potentialMonthlySavings > 0 ? (
              <>
                <div className="text-xl font-semibold">
                  {formatCurrency(potentialMonthlySavings, currency)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(potentialMonthlySavings * 12, currency)}/yr if cancelled
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No savings flagged</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Crown className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most expensive subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostExpensive ? (
              <>
                <div className="text-xl font-semibold">{mostExpensive.name}</div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    toMonthlyCost(mostExpensive.cost, mostExpensive.billingCycle),
                    mostExpensive.currency
                  )}
                  /mo
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest-spend category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCategory ? (
              <>
                <div className="text-xl font-semibold">{CATEGORY_LABELS[topCategory.category]}</div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(topCategory.total, currency)}/mo
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing stands out right now, your spending looks steady.
            </p>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-base">Possibly unused</CardTitle>
        </CardHeader>
        <CardContent>
          {unused.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing flagged, mark subscriptions as used from time to time to keep this accurate.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {unused.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last used{" "}
                      {s.lastUsed
                        ? new Date(s.lastUsed).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "never recorded"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {formatCurrency(toMonthlyCost(s.cost, s.billingCycle), s.currency)}/mo
                    </Badge>
                    <MarkUsedButton id={s.id} name={s.name} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {categoryDeltas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category spend, month over month</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {categoryDeltas.map((d) => (
                <li key={d.category} className="flex items-center justify-between py-3 text-sm">
                  <span>{CATEGORY_LABELS[d.category]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {formatCurrency(d.currentMonth, currency)}/mo
                    </span>
                    {d.pctChange !== null && (
                      <Badge variant={d.pctChange > 0 ? "destructive" : "secondary"}>
                        {d.pctChange > 0 ? "+" : ""}
                        {Math.round(d.pctChange)}%
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
