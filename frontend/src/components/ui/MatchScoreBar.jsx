import { cn } from "@/lib/utils"

export function MatchScoreBar({ score, showLabel = true, variant = "gradient", className }) {
  const fillClass = variant === "solid"
    ? "bg-violet-600 transition-all duration-700"
    : "bg-gradient-to-r from-blue-dark to-teal-light"

  const bar = (
    <div className={cn("h-1.5 rounded-full bg-slate-100 overflow-hidden", showLabel ? "w-20" : "w-full", className)}>
      <div className={cn("h-full rounded-full", fillClass)} style={{ width: `${score}%` }} />
    </div>
  )

  if (!showLabel) return bar

  return (
    <div className="flex items-center gap-2">
      {bar}
      <span className="text-sm font-medium text-slate-700">{score}%</span>
    </div>
  )
}
