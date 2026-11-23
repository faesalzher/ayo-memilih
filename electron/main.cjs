const crypto = require('node:crypto')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { app, BrowserWindow, Menu, shell, protocol, net, ipcMain } = require('electron')

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

const ADMIN_PIN_SALT = Buffer.from('3b641dfe91da7373c5f8a6d6d84f27a9', 'hex')
const ADMIN_PIN_HASH = Buffer.from('cc03122254580f0629c542e0ad9cdeaba00916f97293ad2c7865fc3b498023daff22162fddccfa47079a74e6be26dfb9be9e2af700f0ddd14c2e0b98966e82c4', 'hex')
const MAX_PIN_ATTEMPTS = 5
const PIN_LOCK_MS = 30_000
let failedPinAttempts = 0
let pinLockedUntil = 0

const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173'
const distDir = path.join(__dirname, '../dist')
let mainWindow

function isMainWindowSender(event) {
  return Boolean(mainWindow) && event.sender === mainWindow.webContents
}

ipcMain.handle('admin:verify-pin', (event, pin) => {
  if (!isMainWindowSender(event)) return { ok: false }

  const now = Date.now()
  if (now < pinLockedUntil) return { ok: false, lockedMs: pinLockedUntil - now }

  const valid = typeof pin === 'string' && /^\d{4,8}$/.test(pin)
  const candidate = crypto.scryptSync(valid ? pin : '', ADMIN_PIN_SALT, ADMIN_PIN_HASH.length)
  if (valid && crypto.timingSafeEqual(candidate, ADMIN_PIN_HASH)) {
    failedPinAttempts = 0
    return { ok: true }
  }

  failedPinAttempts += 1
  if (failedPinAttempts >= MAX_PIN_ATTEMPTS) {
    failedPinAttempts = 0
    pinLockedUntil = now + PIN_LOCK_MS
    return { ok: false, lockedMs: PIN_LOCK_MS }
  }
  return { ok: false }
})

ipcMain.handle('admin:restart', (event) => {
  if (!isMainWindowSender(event)) return
  app.relaunch()
  app.exit(0)
})

ipcMain.handle('admin:quit', (event) => {
  if (!isMainWindowSender(event)) return
  app.quit()
})

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } },
])

async function createWindow() {
  const appUrl = app.isPackaged ? 'app://app/index.html' : devServerUrl

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      void shell.openExternal(url)
    }

    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isAppNavigation = app.isPackaged
      ? url === appUrl
      : new URL(url).origin === new URL(devServerUrl).origin

    if (isAppNavigation) return

    event.preventDefault()
    if (url.startsWith('https://') || url.startsWith('http://')) {
      void shell.openExternal(url)
    }
  })

  if (app.isPackaged) {
    await mainWindow.loadURL(appUrl)
  } else {
    await mainWindow.loadURL(devServerUrl)
  }
}

app.whenReady()
  .then(() => {
    Menu.setApplicationMenu(null)
    protocol.handle('app', (request) => {
      const { pathname } = new URL(request.url)
      const requested = decodeURIComponent(pathname === '/' ? '/index.html' : pathname)
      const file = path.join(distDir, requested)
      if (!file.startsWith(distDir)) return new Response('Forbidden', { status: 403 })
      return net.fetch(pathToFileURL(file).href)
    })
    return createWindow()
  })
  .catch((error) => {
    console.error('Failed to launch Ayo Memilih:', error)
    app.quit()
  })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
