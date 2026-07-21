import type { BillingCycle, SubscriptionCategory } from "@/lib/generated/prisma/client";

export type ClientSubscription = {
  id: string;
  name: string;
  category: SubscriptionCategory;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  startDate: string;
  notes: string | null;
  lastUsed: string | null;
  createdAt: string;
};
