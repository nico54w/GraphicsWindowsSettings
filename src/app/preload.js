const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setProcessValues: (callback) => ipcRenderer.on('set-process-values', callback),
    getProcessValues: () => ipcRenderer.send('get-process-values'),
    getCurrentValues: () => ipcRenderer.send('get-current-values'),
    setCurrentValues: (callback) => ipcRenderer.on('set-current-values', callback),
    setNewValue: (obj) => ipcRenderer.send('set-new-value', obj),
    removeValue: (key) => ipcRenderer.send('remove-value', key),
    confirmation: (callback) => ipcRenderer.on('confirmation', callback),
    openFromFile: () => ipcRenderer.send('open-from-file')
})