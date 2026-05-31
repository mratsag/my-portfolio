import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Kart taban stili (padding HARİÇ). Link/anchor gibi elemanlara `cardBase` ile uygulanır. */
export const cardBase = 'rounded-card border border-line bg-surface transition-colors duration-200'

/** Hairline kenarlıklı yüzey kartı (varsayılan padding p-6). */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(cardBase, 'p-6', className)} {...props} />
}
