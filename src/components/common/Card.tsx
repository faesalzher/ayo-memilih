import type { HTMLAttributes, ReactNode } from 'react'

export type CardVariant = 'default' | 'interactive' | 'candidate' | 'information' | 'result'

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'section'
  children: ReactNode
  variant?: CardVariant
}

export default function Card({
  as: Component = 'article',
  children,
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <Component {...props} className={`ui-card ui-card--${variant} ${className}`.trim()}>
      {children}
    </Component>
  )
}
