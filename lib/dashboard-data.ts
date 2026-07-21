import { prisma } from "@/lib/prisma";
import { serializeSubscription } from "@/lib/serialize";
import { toMonthlyCost, daysUntil } from "@/lib/subscription-utils";
import type { ClientSubscription } from "@/lib/types";

export async function getDashboardData(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextRenewalDate: "asc" },
  });

  const data: ClientSubscription[] = subscriptions.map(serializeSubscription);

  const totalMonthly = data.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingCycle), 0);
  const totalAnnual = totalMonthly * 12;

  const upcoming7 = data.filter((s) => {
    const d = daysUntil(new Date(s.nextRenewalDate));
    return d >= 0 && d <= 7;
  });
  const upcoming30 = data.filter((s) => {
    const d = daysUntil(new Date(s.nextRenewalDate));
    return d >= 0 && d <= 30;
  });

  const categoryTotals = new Map<string, number>();
  for (const s of data) {
    const monthly = toMonthlyCost(s.cost, s.billingCycle);
    categoryTotals.set(s.category, (categoryTotals.get(s.category) ?? 0) + monthly);
  }
  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const now = new Date();
  const trend: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const activeTotal = data.reduce((sum, s) => {
      const start = new Date(s.startDate);
      if (start > monthEnd) return sum;
      return sum + toMonthlyCost(s.cost, s.billingCycle);
    }, 0);
    trend.push({
      month: monthDate.toLocaleDateString("en-US", { month: "short" }),
      total: Math.round(activeTotal * 100) / 100,
    });
  }

  const mostExpensive = data.length
    ? data.reduce((max, s) =>
        toMonthlyCost(s.cost, s.billingCycle) > toMonthlyCost(max.cost, max.billingCycle) ? s : max
      )
    : null;

  const topCategory = categoryBreakdown[0] ?? null;

  return {
    subscriptions: data,
    totalMonthly,
    totalAnnual,
    upcoming7,
    upcoming30,
    categoryBreakdown,
    trend,
    mostExpensive,
    topCategory,
  };
}
