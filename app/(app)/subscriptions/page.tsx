import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeSubscription } from "@/lib/serialize";
import { SubscriptionsTable } from "@/components/subscriptions-table";

export default async function SubscriptionsPage() {
  const session = await auth();
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session!.user.id },
    orderBy: { nextRenewalDate: "asc" },
  });

  const data = subscriptions.map(serializeSubscription);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">
          Manage all your recurring subscriptions in one place.
        </p>
      </div>
      <SubscriptionsTable subscriptions={data} />
    </div>
  );
}
