"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSettingsAction, type SettingsActionState } from "@/lib/actions/settings";
import { CURRENCIES } from "@/lib/validations";

const initialState: SettingsActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save changes"}
    </Button>
  );
}

export function SettingsForm({
  name,
  currencyPreference,
}: {
  name: string;
  currencyPreference: string;
}) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Settings saved");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={name} required />
        {state.fieldErrors?.name && (
          <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="currencyPreference">Preferred currency</Label>
        <Select name="currencyPreference" defaultValue={currencyPreference}>
          <SelectTrigger id="currencyPreference" className="w-full">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
