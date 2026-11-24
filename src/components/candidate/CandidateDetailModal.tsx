import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Candidate } from '../../data/candidates'
import Button from '../common/Button'
import BaseModal from '../modal/BaseModal'
import FigmaAsset from '../figma/FigmaAsset'
import { position } from '../../utils/figmaPosition'

type CandidateTab = 'visi' | 'misi' | 'program'

type CandidateDetailModalProps = {
  candidate: Candidate
  candidateIndex: number
  onClose: () => void
}

export default function CandidateDetailModal({
  candidate,
  candidateIndex,
  onClose,
}: CandidateDetailModalProps) {
  const [tab, setTab] = useState<CandidateTab>('visi')
  const content = {
    visi: { title: 'VISI', copy: candidate.vision, items: null },
    misi: { title: 'MISI', copy: '', items: candidate.missions },
    program: { title: 'PROGRAM', copy: '', items: candidate.programs },
  }[tab]

  return (
    <BaseModal
      overlayClassName="detail-backdrop"
      panelClassName="detail-card"
      closeButtonClassName="detail-close"
      closeIcon={<FigmaAsset file="70403.svg" {...position(0, 0, 64, 62)} />}
      closeLabel="Tutup detail kandidat"
      labelledBy="detail-title"
      onClose={onClose}
    >
      <div className="detail-card-shadow" />
      <div
        className="detail-card-surface"
        style={{
          '--detail-accent': candidate.palette.accent,
          '--detail-accent-shadow': candidate.palette.shadow,
          '--detail-accent-text': candidate.palette.text,
        } as CSSProperties}
      >
        <FigmaAsset file="a34c2.svg" {...position(0, 0, 992, 1567)} />
        <header className="detail-header">
          <img className="figma-asset" src={candidate.campaignImage} alt="" style={{ ...position(48, 43, 222, 203), objectFit: 'contain' }} />
          <h2 id="detail-title">{candidate.name}<br /> {candidate.viceName}</h2>
          <FigmaAsset file="58484.svg" {...position(785, 119, 106, 125)} />
          <FigmaAsset file="a6607.svg" {...position(785, 119, 106, 121)} />
          <span className="detail-number">{candidate.number}</span>
          <span className="detail-number-label">NOMOR URUT</span>
        </header>
        <p className="detail-intro">Kenali lebih dekat pasangan calon dan gagasan mereka untuk Kota Batu.</p>
        <nav className="detail-tabs" aria-label="Informasi kandidat">
          {(['visi', 'misi', 'program'] as const).map((item) => (
            <Button
              key={item}
              variant="secondary"
              size="small"
              className={`detail-tab${tab === item ? ' is-active' : ''}`}
              type="button"
              sfx="cardSelect"
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
            >
              {item.toUpperCase()}
            </Button>
          ))}
        </nav>
        <div className="detail-content" aria-live="polite">
          <h3>{content.title}</h3>
          {tab !== 'visi' && content.items ? (
            <ol className="detail-program-list" aria-label={`Daftar ${content.title.toLowerCase()}`}>
              {content.items.map((item, index) => (
                <li key={`${index}-${item}`}>
                  <span className="detail-program-number" aria-hidden="true">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="detail-copy">{content.copy}</p>
          )}
        </div>
        <Button
          className="flow-button detail-return"
          sfx="navigation"
          onClick={onClose}
          leftIcon={<FigmaAsset file="42680.svg" {...position(40, 18, 30, 40)} />}
        >
          <span className="return-label">KEMBALI</span>
        </Button>
        <p className="detail-counter">● &nbsp; Kandidat {candidateIndex + 1} dari 3 &nbsp; ●</p>
      </div>
    </BaseModal>
  )
}
