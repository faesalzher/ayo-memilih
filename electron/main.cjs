const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { app, BrowserWindow, shell, protocol, net } = require('electron')

const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173'
const distDir = path.join(__dirname, '../dist')
let mainWindow

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
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
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
