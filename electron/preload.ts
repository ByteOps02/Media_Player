import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  // Only expose specific channels if needed.
  // For example, to listen for the main process message:
  onMainProcessMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('main-process-message', (_event, message) => callback(message));
  },
  // Remove generic send/invoke/on/off to prevent arbitrary IPC
})
