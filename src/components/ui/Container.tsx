import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** narrow = tek kolon okuma genişliği (codedgar hissi), default = geniş grid. */
  size?: 'default' | 'narrow'
}

/** Sayfa genişliğini ortalayan, yatay padding'li sarmalayıcı. */
export function Container({ size = 'default', className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6',
        size === 'narrow' ? 'max-w-3xl' : 'max-w-[75rem]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
