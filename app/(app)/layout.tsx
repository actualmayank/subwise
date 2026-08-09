import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SidebarNav } from "@/components/sidebar-nav";
import { BottomNav } from "@/components/bottom-nav";
import { LogoutButton } from "@/components/logout-button";
import { RenewalBanner } from "@/components/renewal-banner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!userExists) {
    redirect("/login");
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 sm:flex">
        <Link href="/dashboard" className="mb-8 px-2">
          <Logo height={20} />
        </Link>
        <SidebarNav />
        <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-accent text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:hidden">
          <Link href="/dashboard">
            <Logo height={20} />
          </Link>
          <LogoutButton />
        </header>
        <RenewalBanner />
        <main className="flex-1 px-4 pb-20 pt-4 sm:px-6 sm:pb-8 sm:pt-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
