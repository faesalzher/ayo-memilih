import { useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'

export function useHoldGesture(durationMs: number, onHold?: () => void) {
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const cancel = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
  }

  return {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (!onHold || event.button > 0) return
      cancel()
      timer.current = window.setTimeout(() => {
        timer.current = undefined
        onHold()
      }, durationMs)
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (event: ReactMouseEvent) => event.preventDefault(),
  }
}

export function useTapGesture(tapCount: number, windowMs: number, onTaps?: () => void) {
  const count = useRef(0)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  return () => {
    if (!onTaps) return
    window.clearTimeout(resetTimer.current)
    count.current += 1
    if (count.current >= tapCount) {
      count.current = 0
      onTaps()
      return
    }
    resetTimer.current = window.setTimeout(() => {
      count.current = 0
    }, windowMs)
  }
}
