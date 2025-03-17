// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

console.log('from preload.ts');

const audioAPI = {
    save: (buffer: ArrayBuffer) => ipcRenderer.invoke('save-audio', buffer),
}

contextBridge.exposeInMainWorld('audioAPI', audioAPI);   