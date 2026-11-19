import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'

const SCENE_IMAGE = '/figma-assets/519df.svg'

type ScreenBackgroundProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
  sceneDim?: number
  sceneOpacity?: number
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export default function ScreenBackground<T extends ElementType = 'section'>({
  as,
  children,
  className = '',
  sceneDim = 0,
  sceneOpacity = 1,
  ...props
}: ScreenBackgroundProps<T>) {
  const Component = as ?? 'section'
  const sceneStyle = { '--scene-dim': sceneDim, '--scene-opacity': sceneOpacity } as CSSProperties
  return (
    <Component {...props} className={`ui-screen-background ${className}`.trim()}>
      <img className="ui-screen-background__image" src={SCENE_IMAGE} alt="" aria-hidden="true" style={sceneStyle} />
      {children}
    </Component>
  )
}
