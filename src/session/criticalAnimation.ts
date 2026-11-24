import { useEffect } from 'react'

// Safety cap so a lock whose owner never releases cannot block session reset forever.
const LOCK_MAX_HOLD_MS = 20_000

const holders = new Map<symbol, number>()

export function acquireCriticalAnimation(): () => void {
  const token = Symbol('critical-animation')
  holders.set(token, Date.now())
  return () => {
    holders.delete(token)
  }
}

export function isCriticalAnimationPlaying(): boolean {
  const now = Date.now()
  for (const [token, acquiredAt] of holders) {
    if (now - acquiredAt < LOCK_MAX_HOLD_MS) return true
    holders.delete(token)
  }
  return false
}

export function releaseAllCriticalAnimations() {
  holders.clear()
}

export function useCriticalAnimation(active: boolean) {
  useEffect(() => {
    if (!active) return
    return acquireCriticalAnimation()
  }, [active])
}
