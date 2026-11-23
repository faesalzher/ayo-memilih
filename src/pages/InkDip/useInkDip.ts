import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

export type InkDipState = 'ready' | 'dragging' | 'dipping' | 'lifting' | 'flipping' | 'success'

type Point = { x: number; y: number }

const FINGERTIP = { x: 0.57, y: 0.93 }

export function useInkDip() {
  const [state, setState] = useState<InkDipState>('ready')
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const handRef = useRef<HTMLImageElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<InkDipState>('ready')
  const offsetRef = useRef<Point>({ x: 0, y: 0 })
  const startRef = useRef<{ pointer: Point; offset: Point; id: number } | null>(null)
  const dippedRef = useRef(false)

  const changeState = (next: InkDipState) => {
    stateRef.current = next
    setState(next)
  }

  const moveHand = (next: Point) => {
    const hand = handRef.current?.getBoundingClientRect()
    const target = targetRef.current?.getBoundingClientRect()
    if (!hand || !target) return
    const tipX = hand.left - offsetRef.current.x + next.x + hand.width * FINGERTIP.x
    const tipY = hand.top - offsetRef.current.y + next.y + hand.height * FINGERTIP.y
    const inside = tipX >= target.left && tipX <= target.right && tipY >= target.top && tipY <= target.bottom
    offsetRef.current = next
    setOffset(next)
    if (inside) dippedRef.current = true
    changeState(inside ? 'dipping' : 'dragging')
  }

  const finish = () => {
    startRef.current = null
    offsetRef.current = { x: 0, y: 0 }
    setOffset({ x: 0, y: 0 })
    if (dippedRef.current) changeState('lifting')
    else changeState('ready')
  }

  const cancel = () => {
    startRef.current = null
    dippedRef.current = false
    offsetRef.current = { x: 0, y: 0 }
    setOffset({ x: 0, y: 0 })
    changeState('ready')
  }

  useEffect(() => {
    if (state !== 'lifting' && state !== 'flipping') return
    const next: InkDipState = state === 'lifting' ? 'flipping' : 'success'
    const duration = state === 'lifting' ? 700 : 750
    const timer = window.setTimeout(() => {
      stateRef.current = next
      setState(next)
    }, duration)
    return () => window.clearTimeout(timer)
  }, [state])

  useEffect(() => {
    const resetOnResize = () => {
      if (stateRef.current !== 'dragging' && stateRef.current !== 'dipping') return
      startRef.current = null
      dippedRef.current = false
      offsetRef.current = { x: 0, y: 0 }
      setOffset({ x: 0, y: 0 })
      stateRef.current = 'ready'
      setState('ready')
    }
    window.addEventListener('resize', resetOnResize)
    return () => window.removeEventListener('resize', resetOnResize)
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current !== 'ready' || !event.isPrimary || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    startRef.current = { pointer: { x: event.clientX, y: event.clientY }, offset: offsetRef.current, id: event.pointerId }
    dippedRef.current = false
    changeState('dragging')
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = startRef.current
    if (!start || start.id !== event.pointerId) return
    moveHand({ x: start.offset.x + event.clientX - start.pointer.x, y: start.offset.y + event.clientY - start.pointer.y })
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = startRef.current
    if (!start || start.id !== event.pointerId) return
    moveHand({ x: start.offset.x + event.clientX - start.pointer.x, y: start.offset.y + event.clientY - start.pointer.y })
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    finish()
  }

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (startRef.current?.id !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    cancel()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (stateRef.current === 'lifting' || stateRef.current === 'flipping' || stateRef.current === 'success') return
    if (event.key === 'Escape') { event.preventDefault(); cancel(); return }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (stateRef.current === 'ready') { dippedRef.current = false; changeState('dragging') }
      else finish()
      return
    }
    if (stateRef.current === 'ready' || startRef.current) return
    const directions: Record<string, Point> = { ArrowLeft: { x: -12, y: 0 }, ArrowRight: { x: 12, y: 0 }, ArrowUp: { x: 0, y: -12 }, ArrowDown: { x: 0, y: 12 } }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    moveHand({ x: offsetRef.current.x + direction.x, y: offsetRef.current.y + direction.y })
  }

  return { state, offset, handRef, targetRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown }
}