// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron')

const dataApi: DataApi = {
  query: () => ipcRenderer.invoke('query'),
  exec: () => ipcRenderer.invoke('exec'),
  insertOne: (collection: string, obj: any) => ipcRenderer.invoke('insertOne', collection, obj),
}

contextBridge.exposeInMainWorld('dataApi', dataApi)
