'use strict'
import {
    app,
    BrowserWindow,
    ipcMain
} from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`
function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 765,
        useContentSize: true,
        width: 1382,//1182
        frame: false,
        minWidth: 1182,
        minHeight: 600,
        resizable: true,
        skipTaskbar: false,
        transparent: false,
        title:"QCS",
        autoHideMenuBar:true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            worldSafeExecuteJavaScript: false,
            webSecurity: false,
            nodeIntegrationInWorker: true,
            webviewTag: true,
            enableRemoteModule: true
        },
        x:0,
        y:0
    });

    mainWindow.loadURL(winURL)
//重点在下面这行，开启调试
//     mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('close',e=>{
    mainWindow.close()
})
ipcMain.on('minimize',e=>{
    mainWindow.minimize()
})
ipcMain.on('maximize',e=>{
    mainWindow.maximize()
})
ipcMain.on('unmaximize',e=>{
    mainWindow.unmaximize()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

