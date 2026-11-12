import type { CSSProperties } from 'react'

export function position(x: number, y: number, width: number, height: number): CSSProperties {
  return {
    left: `${x / 10.8}cqw`,
    top: `${y / 10.8}cqw`,
    width: `${width / 10.8}cqw`,
    height: `${height / 10.8}cqw`,
  }
}
