const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffprobe-static').path;
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on('get-movie-info', (event, moviePath) => {
    getMovieInfo(moviePath).then(info => {
        event.reply('movie-info', info);
    }).catch(err => {
        event.reply('movie-info', { error: err.message });
    });
});

ipcMain.on('scan-directory', (event, directoryPath) => {
    scanDirectory(directoryPath).then(result => {
        event.reply('directory-scan', result);
    }).catch(err => {
        event.reply('directory-scan', { error: err.message });
    });
});

function scanDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
        const result = {
            folders: [],
            movies: []
        };

        try {
            const items = fs.readdirSync(directoryPath, { withFileTypes: true });

            items.forEach(item => {
                const itemPath = path.join(directoryPath, item.name);
                
                if (item.isDirectory()) {
                    result.folders.push({
                        name: item.name,
                        path: itemPath
                    });
                } else if (item.isFile() && isVideoFile(item.name)) {
                    result.movies.push({
                        name: item.name,
                        path: itemPath
                    });
                }
            });

            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

function isVideoFile(filename) {
    const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    const ext = path.extname(filename).toLowerCase();
    return videoExtensions.includes(ext);
}

function getMovieInfo(moviePath) {
    return new Promise((resolve, reject) => {
        const cmd = ffmpegPath;
        const args = [
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            moviePath
        ];

        const proc = spawn(cmd, args);
        let output = '';

        proc.stdout.on('data', (data) => {
            output += data;
        });

        proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        proc.on('close', (code) => {
            if (code === 0) {
                try {
                    const info = JSON.parse(output);
                    resolve(info);
                } catch (err) {
                    reject(err);
                }
            } else {
                reject(new Error(`ffprobe exited with code ${code}`));
            }
        });
    });
}