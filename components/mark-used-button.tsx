"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { updateLastUsed } from "@/lib/actions/subscriptions";

export function MarkUsedButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Mark ${name} as used`}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await updateLastUsed(id);
          if (result.error) toast.error(result.error);
          else toast.success(`${name} marked as used today`);
        })
      }
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
    </Button>
  );
}
