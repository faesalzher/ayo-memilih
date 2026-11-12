import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

export type TextVariant = 'display' | 'heading' | 'section' | 'body' | 'caption' | 'button'

type TextProps<T extends ElementType> = {
  as?: T
  variant: TextVariant
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function Text<T extends ElementType = 'p'>({
  as,
  variant,
  children,
  className = '',
  ...props
}: TextProps<T>) {
  const Component = as ?? 'p'
  return <Component {...props} className={`ui-text ui-text--${variant} ${className}`.trim()}>{children}</Component>
}

type ScreenTitleProps = {
  title: string
  subtitle?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  titleAs?: 'h1' | 'h2'
}

export function ScreenTitle({
  title,
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  titleAs: Title = 'h1',
}: ScreenTitleProps) {
  return (
    <section className={`ui-screen-title ${className}`.trim()}>
      <Title className={`ui-text ui-text--heading ${titleClassName}`.trim()}>{title}</Title>
      {subtitle && <p className={`ui-text ui-text--body ${subtitleClassName}`.trim()}>{subtitle}</p>}
    </section>
  )
}
