const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    switchService: (serviceName) => {
        ipcRenderer.send('switch-service', serviceName);
    },
    goBack: () => {
        ipcRenderer.send('go-back');
    },
    reload: () => {
        ipcRenderer.send('reload');
    }
});
