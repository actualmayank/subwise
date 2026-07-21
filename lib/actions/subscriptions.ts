"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { subscriptionSchema } from "@/lib/validations";

export type SubscriptionActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

function parseSubscriptionForm(formData: FormData) {
  const lastUsedRaw = formData.get("lastUsed");
  return subscriptionSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    cost: formData.get("cost"),
    currency: formData.get("currency"),
    billingCycle: formData.get("billingCycle"),
    nextRenewalDate: formData.get("nextRenewalDate"),
    startDate: formData.get("startDate"),
    notes: formData.get("notes"),
    lastUsed: lastUsedRaw ? lastUsedRaw : null,
  });
}

export async function createSubscription(
  _prevState: SubscriptionActionState,
  formData: FormData
): Promise<SubscriptionActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const parsed = parseSubscriptionForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { notes, lastUsed, ...rest } = parsed.data;

  await prisma.subscription.create({
    data: {
      ...rest,
      userId: session.user.id,
      notes: notes || null,
      lastUsed: lastUsed ?? null,
    },
  });

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/insights");
  return { success: true };
}

export async function updateSubscription(
  id: string,
  _prevState: SubscriptionActionState,
  formData: FormData
): Promise<SubscriptionActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const parsed = parseSubscriptionForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Subscription not found." };
  }

  const { notes, lastUsed, ...rest } = parsed.data;

  await prisma.subscription.update({
    where: { id },
    data: {
      ...rest,
      notes: notes || null,
      lastUsed: lastUsed ?? null,
    },
  });

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/insights");
  return { success: true };
}

export async function deleteSubscription(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Subscription not found." };
  }

  await prisma.subscription.delete({ where: { id } });

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/insights");
  return {};
}

export async function updateLastUsed(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Subscription not found." };
  }

  await prisma.subscription.update({ where: { id }, data: { lastUsed: new Date() } });

  revalidatePath("/subscriptions");
  revalidatePath("/insights");
  return {};
}
