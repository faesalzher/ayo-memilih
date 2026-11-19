import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import './TutorialBubble.css'

export type TutorialSpeaker = 'angga' | 'ingga'

const SPEAKERS: Record<TutorialSpeaker, { name: string; avatar: string }> = {
  angga: { name: 'ANGGA', avatar: '/figma-assets/a2f45.png' },
  ingga: { name: 'ANGGI', avatar: '/figma-assets/d918e.png' },
}

const TYPING_INTERVAL_MS = 28
const COLLAPSE_DELAY_MS = 7000

function TypingText({ text, onTypingChange }: { text: string; onTypingChange: (typing: boolean) => void }) {
  const [count, setCount] = useState(0)
  const typing = count < text.length

  useEffect(() => {
    onTypingChange(true)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) {
        window.clearInterval(id)
        onTypingChange(false)
      }
    }, TYPING_INTERVAL_MS)
    return () => {
      window.clearInterval(id)
      onTypingChange(false)
    }
  }, [text, onTypingChange])

  return (
    <div className="tutorial-bubble-stack">
      <p className="tutorial-bubble-text tutorial-bubble-sizer" aria-hidden="true">{text}</p>
      <p className="tutorial-bubble-text">
        {text.slice(0, count)}
        <span className={`tutorial-bubble-caret${typing ? ' is-typing' : ''}`} aria-hidden="true" />
      </p>
    </div>
  )
}

export default function TutorialBubble({ speaker, children }: { speaker: TutorialSpeaker; children: ReactNode }) {
  const [avatarHidden, setAvatarHidden] = useState(false)
  const [talking, setTalking] = useState(false)
  const [collapsedText, setCollapsedText] = useState<string | null>(null)
  const { name, avatar } = SPEAKERS[speaker]
  const text = typeof children === 'string' ? children : ''
  const isLong = text.length > 60
  const collapsed = collapsedText === text

  useEffect(() => {
    if (talking) return
    const id = window.setTimeout(() => setCollapsedText(text), COLLAPSE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [talking, text])

  return (
    <motion.div
      key={speaker}
      className={`tutorial-bubble tutorial-bubble--${speaker}${isLong ? ' tutorial-bubble--wide' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className={`tutorial-bubble-box${collapsed ? ' is-collapsed' : ''}`}>
        <span className="tutorial-bubble-name">{name}</span>
        <TypingText key={text} text={text} onTypingChange={setTalking} />
      </div>
      {!avatarHidden && (
        <img
          className={`tutorial-bubble-avatar${talking ? ' is-talking' : ''}${collapsed ? ' is-collapsed' : ''}`}
          src={avatar}
          alt=""
          draggable={false}
          role={collapsed ? 'button' : undefined}
          aria-label={collapsed ? 'Tampilkan bantuan' : undefined}
          onClick={collapsed ? () => setCollapsedText(null) : undefined}
          onError={() => setAvatarHidden(true)}
        />
      )}
    </motion.div>
  )
}
