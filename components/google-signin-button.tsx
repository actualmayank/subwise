import { GoogleLogo } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { googleSignInAction } from "@/lib/actions/auth";

export function GoogleSignInButton() {
  return (
    <>
      <div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground uppercase">
        <div className="h-px flex-1 bg-divider" />
        or
        <div className="h-px flex-1 bg-divider" />
      </div>
      <form action={googleSignInAction}>
        <Button type="submit" variant="outline" className="w-full gap-2">
          <GoogleLogo weight="bold" />
          Continue with Google
        </Button>
      </form>
    </>
  );
}
