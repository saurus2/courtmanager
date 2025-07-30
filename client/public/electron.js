// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;
let tray;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  // Window Closing option
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin') {
      app.quit(); // 창 닫을 때 애플리케이션 종료
    }
  });
//   mainWindow.webContents.openDevTools();
});
app.on('window-all-closed', () => {
  app.quit();
});
// Dock Icon
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, '../preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
});