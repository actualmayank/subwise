import { prisma } from "@/lib/prisma";
import { serializeSubscription } from "@/lib/serialize";
import { toMonthlyCost } from "@/lib/subscription-utils";
import { CATEGORY_LABELS } from "@/lib/subscription-utils";
import type { ClientSubscription } from "@/lib/types";

const UNUSED_THRESHOLD_DAYS = 45;

export type CategoryDelta = {
  category: string;
  currentMonth: number;
  previousMonth: number;
  pctChange: number | null;
};

export async function getInsights(userId: string) {
  const subscriptions = await prisma.subscription.findMany({ where: { userId } });
  const data: ClientSubscription[] = subscriptions.map(serializeSubscription);

  const now = new Date();
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const spendAsOf = (cutoff: Date, category?: string) =>
    data.reduce((sum, s) => {
      if (category && s.category !== category) return sum;
      if (new Date(s.startDate) > cutoff) return sum;
      return sum + toMonthlyCost(s.cost, s.billingCycle);
    }, 0);

  const categories = Array.from(new Set(data.map((s) => s.category)));
  const categoryDeltas: CategoryDelta[] = categories
    .map((category) => {
      const currentMonth = spendAsOf(currentMonthEnd, category);
      const previousMonth = spendAsOf(previousMonthEnd, category);
      const pctChange =
        previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : null;
      return { category, currentMonth, previousMonth, pctChange };
    })
    .filter((d) => d.currentMonth > 0);

  const unused = data.filter((s) => {
    const referenceDate = s.lastUsed ? new Date(s.lastUsed) : new Date(s.createdAt);
    const daysSince = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= UNUSED_THRESHOLD_DAYS;
  });

  const potentialMonthlySavings = unused.reduce(
    (sum, s) => sum + toMonthlyCost(s.cost, s.billingCycle),
    0
  );

  const mostExpensive = data.length
    ? data.reduce((max, s) =>
        toMonthlyCost(s.cost, s.billingCycle) > toMonthlyCost(max.cost, max.billingCycle) ? s : max
      )
    : null;

  const categoryTotals = new Map<string, number>();
  for (const s of data) {
    categoryTotals.set(
      s.category,
      (categoryTotals.get(s.category) ?? 0) + toMonthlyCost(s.cost, s.billingCycle)
    );
  }
  const topCategoryEntry = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry
    ? { category: topCategoryEntry[0], total: topCategoryEntry[1] }
    : null;

  const suggestions: string[] = [];

  for (const d of categoryDeltas) {
    if (d.pctChange !== null && d.pctChange >= 5) {
      suggestions.push(
        `You're spending ${Math.round(d.pctChange)}% more on ${CATEGORY_LABELS[d.category] ?? d.category} than last month.`
      );
    }
  }

  if (unused.length > 0) {
    const totalWaste = unused.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingCycle), 0);
    suggestions.push(
      `${unused.length} subscription${unused.length > 1 ? "s haven't" : " hasn't"} been used in over ${UNUSED_THRESHOLD_DAYS} days, costing ~${totalWaste.toFixed(2)}/mo combined.`
    );
  }

  if (mostExpensive) {
    suggestions.push(
      `${mostExpensive.name} is your most expensive subscription at ${toMonthlyCost(mostExpensive.cost, mostExpensive.billingCycle).toFixed(2)}/mo.`
    );
  }

  return {
    subscriptions: data,
    unused,
    potentialMonthlySavings,
    mostExpensive,
    topCategory,
    categoryDeltas,
    suggestions,
  };
}
