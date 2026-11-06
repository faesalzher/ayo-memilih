import gsap from 'gsap'
import * as THREE from 'three'
import type { BallotPhase } from './ballotTypes'

export type PaperAnimationRefs = {
  root: THREE.Group
  leftTop: THREE.Group
  rightTop: THREE.Group
  bottomRow: THREE.Group
  leftBottom: THREE.Group
  rightBottom: THREE.Group
  shadow: THREE.Mesh
}

const PANEL_HEIGHT = 2

export function animatePaperPhase(
  phase: BallotPhase,
  refs: PaperAnimationRefs,
  onOpenComplete?: () => void,
  onFlipComplete?: () => void,
  onRefoldOuterComplete?: () => void,
  onFoldComplete?: () => void,
) {
  const { root, leftTop, rightTop, bottomRow, leftBottom, rightBottom, shadow } = refs
  const motionScale = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 4 : 1
  const setOpenPose = () => {
    gsap.set(root.position, { x: 0, y: 0, z: 0 })
    gsap.set(root.rotation, { x: 0, y: 0, z: 0 })
    gsap.set([leftTop.rotation, rightTop.rotation, leftBottom.rotation, rightBottom.rotation], { y: 0 })
    gsap.set(bottomRow.rotation, { x: 0 })
    gsap.set([leftTop.position, rightTop.position, bottomRow.position, leftBottom.position, rightBottom.position], { z: 0 })
  }

  if (phase === 'folded-cover') {
    gsap.set(root.position, { y: -PANEL_HEIGHT / 2, z: 0 })
    gsap.set(root.rotation, { x: 0, y: 0, z: 0 })
    gsap.set(leftTop.rotation, { y: Math.PI })
    gsap.set(rightTop.rotation, { y: -Math.PI })
    gsap.set(bottomRow.rotation, { x: Math.PI })
    gsap.set(leftBottom.rotation, { y: Math.PI })
    gsap.set(rightBottom.rotation, { y: -Math.PI })
    gsap.set([leftTop.position, rightTop.position, bottomRow.position], { z: -0.025 })
    gsap.set([leftBottom.position, rightBottom.position], { z: -0.008 })
    gsap.set(shadow.position, { y: -0.12 })
    gsap.set(shadow.scale, { x: 0.72, y: 0.85 })
    gsap.set(shadow.material, { opacity: 0.23 })
    return
  }

  if (phase === 'opening-outer-fold') {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: onOpenComplete })
    timeline.to([leftTop.rotation, rightTop.rotation, leftBottom.rotation, rightBottom.rotation], { y: 0, duration: 1.35 }, 0)
    timeline.to(bottomRow.rotation, { x: 0, duration: 1.35 }, 0)
    timeline.to(root.position, { y: 0, duration: 1.35 }, 0)
    timeline.to([leftTop.position, rightTop.position, bottomRow.position, leftBottom.position, rightBottom.position], { z: 0, duration: 1.15 }, 0.1)
    timeline.to(shadow.position, { y: -PANEL_HEIGHT - 0.1, duration: 1.25 }, 0.05)
    timeline.to(shadow.scale, { x: 2.65, y: 0.55, duration: 1.15 }, 0.1)
    timeline.to(shadow.material, { opacity: 0.14, duration: 1.1 }, 0.15)
    timeline.timeScale(motionScale)
    return () => { timeline.kill() }
  }

  if (phase === 'outer-open') {
    setOpenPose()
    gsap.set(shadow.position, { y: -PANEL_HEIGHT - 0.1 })
    gsap.set(shadow.scale, { x: 2.65, y: 0.55 })
    gsap.set(shadow.material, { opacity: 0.14 })
    return
  }

  if (phase === 'flipping-inner') {
    setOpenPose()
    const timeline = gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: onFlipComplete })
    timeline.to(root.rotation, { y: Math.PI, x: -0.045, z: 0.012, duration: 1.28, ease: 'sine.inOut' }, 0)
    timeline.to(root.position, { z: 0.17, duration: 0.52, ease: 'sine.out' }, 0)
    timeline.to(root.position, { z: 0, duration: 0.62, ease: 'sine.in' }, 0.66)
    timeline.to(leftTop.rotation, { y: -0.028, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.1)
    timeline.to(rightTop.rotation, { y: 0.028, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.16)
    timeline.to(bottomRow.rotation, { x: 0.02, duration: 0.38, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.2)
    timeline.to([leftBottom.rotation, rightBottom.rotation], { y: 0.018, duration: 0.38, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.24)
    timeline.to(root.rotation, { x: 0, z: 0, duration: 0.28, ease: 'sine.out' }, 1)
    timeline.to(shadow.scale, { x: 3.1, y: 0.72, duration: 0.62, ease: 'sine.inOut' }, 0.16)
    timeline.to(shadow.material, { opacity: 0.2, duration: 0.52, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.18)
    timeline.timeScale(motionScale)
    return () => { timeline.kill() }
  }

  if (phase === 'opened') {
    setOpenPose()
    gsap.set(root.rotation, { y: Math.PI })
    gsap.set(shadow.scale, { x: 2.65, y: 0.55 })
    gsap.set(shadow.material, { opacity: 0.16 })
    return
  }

  if (phase === 'refolding-outer') {
    setOpenPose()
    gsap.set(root.rotation, { y: Math.PI })
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        gsap.set(root.rotation, { x: 0, y: 0, z: 0 })
        onRefoldOuterComplete?.()
      },
    })
    timeline.to(root.position, { z: 0.16, duration: 0.18, ease: 'sine.out' }, 0)
    timeline.to(root.rotation, { y: 0, duration: 0.72, ease: 'power2.inOut' }, 0.08)
    timeline.to(root.position, { z: 0, duration: 0.3, ease: 'sine.in' }, 0.48)
    timeline.to(shadow.scale, { x: 2.1, y: 0.66, duration: 0.62, ease: 'sine.inOut' }, 0.08)
    timeline.timeScale(motionScale)
    return () => { timeline.kill() }
  }

  if (phase === 'folding-cover') {
    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut', overwrite: 'auto' },
      onComplete: onFoldComplete,
    })
    // Reverse the same panel hinges used by the opening animation. Fold the
    // lower row first, then bring both outer columns back over the center cover.
    timeline.to(bottomRow.rotation, { x: Math.PI, duration: 0.72 }, 0)
    timeline.to([leftBottom.rotation, rightBottom.rotation], { y: (index) => index === 0 ? Math.PI : -Math.PI, duration: 0.72 }, 0.08)
    timeline.to([leftTop.rotation, rightTop.rotation], { y: (index) => index === 0 ? Math.PI : -Math.PI, duration: 0.78 }, 0.36)
    timeline.to(root.position, { y: -PANEL_HEIGHT / 2, duration: 0.9, ease: 'power2.inOut' }, 0.24)
    timeline.to([leftTop.position, rightTop.position, bottomRow.position], { z: -0.025, duration: 0.66 }, 0.38)
    timeline.to([leftBottom.position, rightBottom.position], { z: -0.008, duration: 0.66 }, 0.38)
    timeline.to(shadow.scale, { x: 0.72, y: 0.85, duration: 0.9 }, 0.2)
    timeline.to(shadow.material, { opacity: 0.23, duration: 0.78 }, 0.25)
    timeline.timeScale(motionScale)
    return () => { timeline.kill() }
  }
}
