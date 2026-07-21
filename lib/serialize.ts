import type { Subscription } from "@/lib/generated/prisma/client";
import type { ClientSubscription } from "@/lib/types";

export function serializeSubscription(sub: Subscription): ClientSubscription {
  return {
    id: sub.id,
    name: sub.name,
    category: sub.category,
    cost: Number(sub.cost),
    currency: sub.currency,
    billingCycle: sub.billingCycle,
    nextRenewalDate: sub.nextRenewalDate.toISOString(),
    startDate: sub.startDate.toISOString(),
    notes: sub.notes,
    lastUsed: sub.lastUsed ? sub.lastUsed.toISOString() : null,
    createdAt: sub.createdAt.toISOString(),
  };
}
