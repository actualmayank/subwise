import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, height = 24 }: { className?: string; height?: number }) {
  const width = Math.round((height * 752) / 231);
  return (
    <Image
      src="/logo.png"
      alt="Subwise"
      width={width}
      height={height}
      priority
      className={cn(className)}
      style={{ height, width: "auto" }}
    />
  );
}
