import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
        Subscription spend, finally under control
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Track every subscription. <span className="text-primary">Stop the silent drain.</span>
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Subwise tracks your recurring subscriptions, surfaces upcoming renewals, and gives you
        analytics-driven insights into where your money actually goes.
      </p>
      <div className="mt-8 flex gap-3">
        <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
          Get started
        </Button>
        <Button render={<Link href="/login" />} nativeButton={false} size="lg" variant="outline">
          Log in
        </Button>
      </div>
    </div>
  );
}
