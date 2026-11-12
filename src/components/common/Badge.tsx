import type { HTMLAttributes, ReactNode } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: 'default' | 'number' | 'status'
}

export default function Badge({ children, className = '', variant = 'default', ...props }: BadgeProps) {
  return <span {...props} className={`ui-badge ui-badge--${variant} ${className}`.trim()}>{children}</span>
}
