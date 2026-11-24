import { useEffect, useRef } from 'react'
import { isCriticalAnimationPlaying } from './criticalAnimation'

export const IDLE_TIMEOUT_MS = 120_000
const CRITICAL_RECHECK_MS = 250
const ACTIVITY_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'wheel'] as const
const ACTIVITY_OPTIONS: AddEventListenerOptions = { capture: true, passive: true }

export function useVisitorIdleTimeout(enabled: boolean, onTimeout: () => void) {
  const lastActivityAt = useRef(0)
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    const markActivity = () => {
      lastActivityAt.current = Date.now()
    }
    ACTIVITY_EVENTS.forEach((type) => window.addEventListener(type, markActivity, ACTIVITY_OPTIONS))
    return () => ACTIVITY_EVENTS.forEach((type) => window.removeEventListener(type, markActivity, ACTIVITY_OPTIONS))
  }, [])

  useEffect(() => {
    if (!enabled) return
    lastActivityAt.current = Date.now()
    let timer: number | undefined

    const check = () => {
      const remaining = lastActivityAt.current + IDLE_TIMEOUT_MS - Date.now()
      if (remaining > 0) {
        timer = window.setTimeout(check, remaining)
        return
      }
      if (isCriticalAnimationPlaying()) {
        timer = window.setTimeout(check, CRITICAL_RECHECK_MS)
        return
      }
      onTimeoutRef.current()
    }

    timer = window.setTimeout(check, IDLE_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [enabled])
}
