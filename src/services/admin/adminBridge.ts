export type AdminPinResult = { ok: boolean; lockedMs?: number }

type AyoAdminBridge = {
  verifyPin: (pin: string) => Promise<AdminPinResult>
  restart: () => Promise<void>
  quit: () => Promise<void>
}

declare global {
  interface Window {
    ayoAdmin?: AyoAdminBridge
  }
}

export const adminBridge = {
  verifyPin: (pin: string): Promise<AdminPinResult> =>
    window.ayoAdmin ? window.ayoAdmin.verifyPin(pin) : Promise.resolve({ ok: false }),
  restart: (): Promise<void> => window.ayoAdmin?.restart() ?? Promise.resolve(),
  quit: (): Promise<void> => window.ayoAdmin?.quit() ?? Promise.resolve(),
}
