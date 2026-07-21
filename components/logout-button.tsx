"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth-logout";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </form>
  );
}
