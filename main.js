const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Cargar la app de Vite en desarrollo
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);
