"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowUpDown, Search, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionForm } from "@/components/subscription-form";
import { deleteSubscription } from "@/lib/actions/subscriptions";
import { CATEGORY_LABELS, formatCurrency, toMonthlyCost } from "@/lib/subscription-utils";
import { CATEGORIES } from "@/lib/validations";
import type { ClientSubscription } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "name" | "cost" | "nextRenewalDate";

export function SubscriptionsTable({ subscriptions }: { subscriptions: ClientSubscription[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("nextRenewalDate");
  const [sortAsc, setSortAsc] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = subscriptions;
    if (category !== "all") {
      rows = rows.filter((s) => s.category === category);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((s) => s.name.toLowerCase().includes(q));
    }
    const sorted = [...rows].sort((a, b) => {
      let diff = 0;
      if (sortKey === "name") diff = a.name.localeCompare(b.name);
      else if (sortKey === "cost")
        diff = toMonthlyCost(a.cost, a.billingCycle) - toMonthlyCost(b.cost, b.billingCycle);
      else diff = new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
      return sortAsc ? diff : -diff;
    });
    return sorted;
  }, [subscriptions, query, category, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleDelete(id: string, name: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteSubscription(id);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${name} deleted`);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={(value) => setCategory(value ?? "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SubscriptionForm />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton label="Name" active={sortKey === "name"} asc={sortAsc} onClick={() => toggleSort("name")} />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <SortButton label="Monthly cost" active={sortKey === "cost"} asc={sortAsc} onClick={() => toggleSort("cost")} />
              </TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>
                <SortButton
                  label="Next renewal"
                  active={sortKey === "nextRenewalDate"}
                  asc={sortAsc}
                  onClick={() => toggleSort("nextRenewalDate")}
                />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  {subscriptions.length === 0
                    ? "No subscriptions yet. Add your first one to get started."
                    : "No subscriptions match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((sub) => (
                <TableRow key={sub.id} className={cn(deletingId === sub.id && isPending && "opacity-50")}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{CATEGORY_LABELS[sub.category]}</Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(toMonthlyCost(sub.cost, sub.billingCycle), sub.currency)}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{sub.billingCycle}</TableCell>
                  <TableCell>
                    {new Date(sub.nextRenewalDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <SubscriptionForm subscription={sub} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${sub.name}`}
                        disabled={isPending}
                        onClick={() => handleDelete(sub.id, sub.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SortButton({
  label,
  active,
  asc,
  onClick,
}: {
  label: string;
  active: boolean;
  asc: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      <ArrowUpDown className={cn("h-3 w-3", active && asc && "rotate-180")} />
    </button>
  );
}
