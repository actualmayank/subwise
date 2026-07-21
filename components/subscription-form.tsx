"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Pencil } from "lucide-react";
import {
  createSubscription,
  updateSubscription,
  type SubscriptionActionState,
} from "@/lib/actions/subscriptions";
import { CATEGORIES, BILLING_CYCLES, CURRENCIES } from "@/lib/validations";
import { CATEGORY_LABELS } from "@/lib/subscription-utils";
import type { ClientSubscription } from "@/lib/types";

const initialState: SubscriptionActionState = {};

function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function SubscriptionForm({ subscription }: { subscription?: ClientSubscription }) {
  const isEdit = !!subscription;
  const action = isEdit ? updateSubscription.bind(null, subscription.id) : createSubscription;
  const [state, formAction] = useActionState(action, initialState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success(isEdit ? "Subscription updated" : "Subscription added");
      setOpen(false);
    }
  }, [state.success, isEdit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm" aria-label={`Edit ${subscription!.name}`} />
          ) : (
            <Button className="gap-1.5" />
          )
        }
      >
        {isEdit ? <Pencil className="h-3.5 w-3.5" /> : (
          <>
            <Plus className="h-4 w-4" />
            Add subscription
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit subscription" : "Add subscription"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the details for this subscription."
                : "Track a new recurring subscription."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Netflix"
                defaultValue={subscription?.name}
                required
              />
              {state.fieldErrors?.name && (
                <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={subscription?.category ?? "other"}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billingCycle">Billing cycle</Label>
                <Select name="billingCycle" defaultValue={subscription?.billingCycle ?? "monthly"}>
                  <SelectTrigger id="billingCycle" className="w-full">
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {BILLING_CYCLES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c[0].toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="15.99"
                  defaultValue={subscription?.cost}
                  required
                />
                {state.fieldErrors?.cost && (
                  <p className="text-xs text-destructive">{state.fieldErrors.cost[0]}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency" defaultValue={subscription?.currency ?? "USD"}>
                  <SelectTrigger id="currency" className="w-full">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={toDateInputValue(subscription?.startDate) || undefined}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nextRenewalDate">Next renewal</Label>
                <Input
                  id="nextRenewalDate"
                  name="nextRenewalDate"
                  type="date"
                  defaultValue={toDateInputValue(subscription?.nextRenewalDate) || undefined}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastUsed">Last used (optional)</Label>
              <Input
                id="lastUsed"
                name="lastUsed"
                type="date"
                defaultValue={toDateInputValue(subscription?.lastUsed) || undefined}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Shared with family"
                defaultValue={subscription?.notes ?? ""}
              />
            </div>

            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          </div>

          <DialogFooter>
            <SubmitButton label={isEdit ? "Save changes" : "Add subscription"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
