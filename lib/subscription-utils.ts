import type { BillingCycle } from "@/lib/generated/prisma/client";

const CYCLE_MONTHS: Record<BillingCycle, number> = {
  weekly: 12 / 52,
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export function toMonthlyCost(cost: number, billingCycle: BillingCycle): number {
  return cost / CYCLE_MONTHS[billingCycle];
}

export function toAnnualCost(cost: number, billingCycle: BillingCycle): number {
  return toMonthlyCost(cost, billingCycle) * 12;
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export const CATEGORY_LABELS: Record<string, string> = {
  streaming: "Streaming",
  software: "Software",
  fitness: "Fitness",
  utilities: "Utilities",
  other: "Other",
};

export const CATEGORY_COLORS: Record<string, string> = {
  streaming: "var(--chart-1)",
  software: "var(--chart-2)",
  fitness: "var(--chart-3)",
  utilities: "var(--chart-4)",
  other: "var(--chart-5)",
};

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
