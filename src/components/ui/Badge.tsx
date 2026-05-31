import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Etiket/pill — teknoloji isimleri, durum vb. için. */
export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
