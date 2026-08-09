import Link from "next/link";
import { List } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MarketingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1180px] items-center gap-6 px-6 py-5">
      <Link href="/" className="mr-auto">
        <Logo height={22} />
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
        <Link href="/product" className="hover:text-foreground">
          Product
        </Link>
        <Link href="/pricing" className="hover:text-foreground">
          Pricing
        </Link>
      </nav>
      <Button
        render={<Link href="/login" />}
        nativeButton={false}
        variant="outline"
        className="hidden sm:inline-flex"
      >
        Log in
      </Button>
      <Button render={<Link href="/signup" />} nativeButton={false} className="hidden sm:inline-flex">
        Start free
      </Button>

      <Sheet>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="sm:hidden" />}
        >
          <List size={20} />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-xs gap-6">
          <SheetHeader>
            <SheetTitle>
              <Logo height={20} />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            <SheetClose
              render={<Link href="/product" />}
              nativeButton={false}
              className="rounded-md px-2 py-2.5 text-sm hover:bg-foreground/7"
            >
              Product
            </SheetClose>
            <SheetClose
              render={<Link href="/pricing" />}
              nativeButton={false}
              className="rounded-md px-2 py-2.5 text-sm hover:bg-foreground/7"
            >
              Pricing
            </SheetClose>
          </nav>
          <div className="mt-auto flex flex-col gap-2 p-4">
            <Button render={<Link href="/login" />} nativeButton={false} variant="outline">
              Log in
            </Button>
            <Button render={<Link href="/signup" />} nativeButton={false}>
              Start free
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
