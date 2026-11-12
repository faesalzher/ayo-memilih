import './IdleScreen.css'
import Button from '../../components/common/Button'
import ScreenBackground from '../../components/layout/ScreenBackground'

type IdleScreenProps = {
  onStart: () => void
}

const assets = '/idle-assets'

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <main className="idle-screen-page">
      <ScreenBackground
        as={Button}
        className="idle-screen"
        backgroundImage={`${assets}/flowing-background.svg`}
        onClick={onStart}
        aria-label="Sentuh untuk memulai simulasi e-voting"
      >
        <img className="idle-social-links" src={`${assets}/social-links.png`} alt="Situs dan media sosial KPU Kota Batu" />
        <img className="idle-kpu-logo" src={`${assets}/kpu-logo.png`} alt="Logo Komisi Pemilihan Umum" />
        <p className="idle-kpu-name">
          <span>KOMISI PEMILIHAN UMUM</span>
          <span>KOTA BATU</span>
        </p>

        <img className="idle-sparkle idle-sparkle-top" src={`${assets}/sparkle.svg`} alt="" />
        <img className="idle-sparkle idle-sparkle-left" src={`${assets}/sparkle.svg`} alt="" />
        <img className="idle-sparkle idle-sparkle-bottom" src={`${assets}/sparkle.svg`} alt="" />

        <h1 className="idle-headline">
          <span>Ayo, Ikutan</span>
          <span>Simulasi</span>
          <span>E-Voting!</span>
        </h1>
        <p className="idle-subheading">Sentuh layar untuk memulai!</p>

        <div className="idle-mascot-panel" aria-hidden="true">
          <img className="idle-mascot-image" src={`${assets}/mascot-panel.png`} alt="" />
          <img className="idle-panel-glow idle-panel-glow-tl" src={`${assets}/panel-glow-tl.svg`} alt="" />
          <img className="idle-panel-glow idle-panel-glow-br" src={`${assets}/panel-glow-br.svg`} alt="" />
        </div>

        <span className="idle-start-label">SENTUH UNTUK MEMULAI <span aria-hidden="true">→</span></span>
        <span className="idle-footer">Simulasi edukasi pemilu • Gratis untuk belajar</span>
        <img className="idle-footer-curve" src={`${assets}/footer-curve.svg`} alt="" />
      </ScreenBackground>
    </main>
  )
}
