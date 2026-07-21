import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardData } from "@/lib/dashboard-data";
import { StatCard } from "@/components/stat-card";
import { UpcomingRenewals } from "@/components/upcoming-renewals";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TrendChart } from "@/components/charts/trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/subscription-utils";
import { DollarSign, CalendarClock, Layers, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session!.user.id } });
  const currency = user.currencyPreference;

  const { subscriptions, totalMonthly, totalAnnual, upcoming7, upcoming30, categoryBreakdown, trend } =
    await getDashboardData(user.id);

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Subwise</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          You haven&apos;t added any subscriptions yet. Add your first one to see spend
          analytics, renewal reminders, and insights.
        </p>
        <Button render={<Link href="/subscriptions" />} nativeButton={false} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add your first subscription
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your subscription spend at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly spend"
          value={formatCurrency(totalMonthly, currency)}
          icon={DollarSign}
        />
        <StatCard
          label="Annual spend"
          value={formatCurrency(totalAnnual, currency)}
          icon={DollarSign}
        />
        <StatCard
          label="Due in 7 days"
          value={String(upcoming7.length)}
          sublabel={`${upcoming30.length} due in 30 days`}
          icon={CalendarClock}
        />
        <StatCard
          label="Active subscriptions"
          value={String(subscriptions.length)}
          sublabel={`${categoryBreakdown.length} categories`}
          icon={Layers}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryBreakdown} currency={currency} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">6-month spend trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trend} currency={currency} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming renewals (next 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingRenewals subscriptions={upcoming30} />
        </CardContent>
      </Card>
    </div>
  );
}
