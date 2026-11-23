import { useEffect, useState } from 'react'
import BaseModal from '../modal/BaseModal'
import Button from '../common/Button'
import { adminBridge } from '../../services/admin/adminBridge'
import './AdminAccessDialog.css'

const PIN_LENGTH = 4
const PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export default function AdminAccessDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'pin' | 'menu'>('pin')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (value: string) => {
    setBusy(true)
    const result = await adminBridge.verifyPin(value)
    setBusy(false)
    setPin('')
    if (result.ok) {
      setError('')
      setStep('menu')
      return
    }
    setError(result.lockedMs ? `Terkunci, coba lagi dalam ${Math.ceil(result.lockedMs / 1000)} detik` : 'PIN salah')
  }

  const addDigit = (digit: string) => {
    if (busy || pin.length >= PIN_LENGTH) return
    const next = pin + digit
    setPin(next)
    if (next.length === PIN_LENGTH) void submit(next)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopImmediatePropagation()
        onClose()
        return
      }
      if (step !== 'pin') return
      if (/^\d$/.test(event.key)) {
        event.stopImmediatePropagation()
        addDigit(event.key)
      } else if (event.key === 'Backspace') {
        event.stopImmediatePropagation()
        setPin((current) => current.slice(0, -1))
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  })

  return (
    <BaseModal onClose={onClose} labelledBy="admin-title" overlayClassName="admin-overlay" panelClassName="admin-panel">
      {step === 'pin' ? (
        <div className="admin-body">
          <h2 id="admin-title" className="admin-title">Akses Administrator</h2>
          <div className="admin-dots" role="img" aria-label={`${pin.length} dari ${PIN_LENGTH} digit terisi`}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <span key={index} className={index < pin.length ? 'admin-dot is-filled' : 'admin-dot'} />
            ))}
          </div>
          <p className="admin-error" role="alert">{error}</p>
          <div className="admin-pad">
            {PAD_KEYS.map((digit) => (
              <Button key={digit} variant="outline" className="admin-key" disabled={busy} onClick={() => addDigit(digit)}>
                {digit}
              </Button>
            ))}
            <span aria-hidden="true" />
            <Button variant="outline" className="admin-key" disabled={busy} onClick={() => addDigit('0')}>0</Button>
            <Button variant="outline" className="admin-key" disabled={busy} onClick={() => setPin((current) => current.slice(0, -1))} aria-label="Hapus digit">
              ⌫
            </Button>
          </div>
        </div>
      ) : (
        <div className="admin-body">
          <h2 id="admin-title" className="admin-title">Menu Administrator</h2>
          <div className="admin-menu">
            <Button variant="secondary" fullWidth onClick={() => void adminBridge.restart()}>Restart aplikasi</Button>
            <Button variant="danger" fullWidth onClick={() => void adminBridge.quit()}>Tutup aplikasi</Button>
            <Button variant="outline" fullWidth onClick={onClose}>Kembali ke aplikasi</Button>
          </div>
        </div>
      )}
    </BaseModal>
  )
}
