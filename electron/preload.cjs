const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ayoAdmin', {
  verifyPin: (pin) => ipcRenderer.invoke('admin:verify-pin', pin),
  restart: () => ipcRenderer.invoke('admin:restart'),
  quit: () => ipcRenderer.invoke('admin:quit'),
})
