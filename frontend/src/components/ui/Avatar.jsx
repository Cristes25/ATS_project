import { cn } from "@/lib/utils"

// Gradientes del brand rotados por índice para dar variedad visual
const gradients = [
  "from-blue-dark to-teal-light",
  "from-purple-dark to-blue-dark",
  "from-teal-dark to-blue-light",
  "from-purple-light to-purple-dark",
]

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function getGradient(name = "") {
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

const sizeClasses = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-20 text-xl",
}

export function Avatar({ name, src, size = "sm", shape = "circle", className }) {
  const initials = getInitials(name)
  const gradient = getGradient(name)
  const shapeClass = shape === "square" ? "rounded-xl" : "rounded-full"

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "object-cover shrink-0",
          shapeClass,
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br flex items-center justify-center shrink-0 font-semibold text-white",
        shapeClass,
        gradient,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
