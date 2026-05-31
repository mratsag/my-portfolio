import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionHeadingProps = {
  /** Bölüm numarası, örn. "02" */
  index?: string
  /** Mono kod-yorumu etiketi, örn. "// section.about" */
  eyebrow?: string
  title: ReactNode
  center?: boolean
  className?: string
}

/** codedgar-tarzı bölüm başlığı: `02  // section.about` + büyük sans başlık. */
export function SectionHeading({ index, eyebrow, title, center, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', center && 'text-center', className)}>
      {(index || eyebrow) && (
        <p className="mb-4 font-mono text-sm">
          {index && <span className="font-semibold text-accent">{index}</span>}
          {index && eyebrow ? '  ' : ''}
          {eyebrow && <span className="text-muted">{eyebrow}</span>}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
    </div>
  )
}
