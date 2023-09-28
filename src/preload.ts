// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dataApi', {
  query: () => ipcRenderer.invoke('query'),
  exec: () => ipcRenderer.invoke('exec')
})
