const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getMovieInfo: (moviePath) => ipcRenderer.invoke('get-movie-info', moviePath),
    scanDirectory: (directoryPath) => ipcRenderer.invoke('scan-directory', directoryPath)
});