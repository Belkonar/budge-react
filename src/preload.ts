// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { contextBridge, ipcRenderer } from 'electron'

function dataApi(request: IpcRequest) {
  return ipcRenderer.invoke('dataApi', request)
}

contextBridge.exposeInMainWorld('dataApi', dataApi)
contextBridge.exposeInMainWorld('ready', () => { ipcRenderer.invoke('ready') })
