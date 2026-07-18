import { CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react"
import { cn } from "../../lib/utils"

type AlertType = "success" | "error" | "info"

export function Alert({ type = "info", message }: { type?: AlertType; message?: string | null }) {
  if (!message) return null

  const config = {
    success: { icon: CheckCircle2, cls: "bg-success/10 text-success border-success/30" },
    error: { icon: AlertCircle, cls: "bg-danger/10 text-danger border-danger/30" },
    info: { icon: Info, cls: "bg-primary/10 text-accent border-primary/30" },
  }[type]

  const Icon = config.icon

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm animate-fade-in-up",
        config.cls,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-6 w-6 animate-spin text-primary", className)} />
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-2 rounded-2xl py-16 text-center">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
