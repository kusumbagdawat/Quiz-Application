import type { HTMLAttributes } from "react"
import { cn } from "../../lib/utils"

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("glass rounded-2xl p-6 shadow-xl shadow-black/20", className)}
      {...props}
    />
  )
}

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "admin" | "user" | "success" | "warning" }) {
  const tones: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    admin: "bg-primary/15 text-accent border border-primary/30",
    user: "bg-success/15 text-success border border-success/30",
    success: "bg-success/15 text-success border border-success/30",
    warning: "bg-warning/15 text-warning border border-warning/30",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
