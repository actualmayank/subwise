import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/subscription-utils";

export function LogoTile({
  name,
  category = "other",
  size = 28,
  className,
}: {
  name: string;
  category?: string;
  size?: number;
  className?: string;
}) {
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md text-[11px] font-semibold uppercase text-foreground ring-1 ring-inset ring-border",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--muted)",
        backgroundImage: `repeating-linear-gradient(135deg, ${color} 0 3px, transparent 3px 6px)`,
      }}
      aria-hidden
    >
      {name.charAt(0)}
    </div>
  );
}
