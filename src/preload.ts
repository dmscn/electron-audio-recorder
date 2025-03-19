// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

const audioAPI = {
    save: (buffer: ArrayBuffer, owner: string) => ipcRenderer.invoke('save-audio', buffer, owner),
}

contextBridge.exposeInMainWorld('audioAPI', audioAPI);