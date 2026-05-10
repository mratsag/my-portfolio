// Basit, animasyonlu skeleton bloğu. Tailwind class'larıyla customize edilebilir.
// Örnek: <Skeleton className="h-8 w-32" />

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  )
}
