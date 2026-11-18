import type { ComponentProps } from 'react'
import Button from '../common/Button'
import FigmaAsset from '../figma/FigmaAsset'
import { position } from '../../utils/figmaPosition'

const ARROW_ICONS = {
  back: { file: 'b92ba.svg', iconPosition: position(10, 4, 144, 138) },
  next: { file: 'd4790.svg', iconPosition: position(5, 4, 144, 138) },
} as const

type GuideArrowButtonProps = Omit<ComponentProps<typeof Button>, 'variant' | 'children'> & {
  direction: keyof typeof ARROW_ICONS
}

export default function GuideArrowButton({ direction, className = '', ...props }: GuideArrowButtonProps) {
  const icon = ARROW_ICONS[direction]

  return (
    <Button variant="icon-only" className={`guide-arrow ${className}`.trim()} {...props}>
      <FigmaAsset file={icon.file} {...icon.iconPosition} />
    </Button>
  )
}
