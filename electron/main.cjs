const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { app, BrowserWindow, shell } = require('electron')

const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173'
let mainWindow

async function createWindow() {
  const appUrl = app.isPackaged
    ? pathToFileURL(path.join(__dirname, '../dist/index.html')).href
    : devServerUrl

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
    await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    await mainWindow.loadURL(devServerUrl)
  }
}

app.whenReady()
  .then(createWindow)
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
