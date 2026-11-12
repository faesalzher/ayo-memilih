import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type ScreenBackgroundProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
  backgroundImage?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export default function ScreenBackground<T extends ElementType = 'section'>({
  as,
  children,
  className = '',
  backgroundImage,
  ...props
}: ScreenBackgroundProps<T>) {
  const Component = as ?? 'section'
  return (
    <Component {...props} className={`ui-screen-background ${className}`.trim()}>
      {backgroundImage && <img className="ui-screen-background__image" src={backgroundImage} alt="" aria-hidden="true" />}
      {children}
    </Component>
  )
}
