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
// const { cv, cvTranslateError } = require('opencv-wasm');
//console.log(cv);
import * as cacImgVal from "../renderer/utils/image";
// import  THRESH_BINARY from 'opencv-wasm/opencv.js';
// import  Mat  from 'opencv-wasm/opencv.js';
// import {  THRESH_OTSU,  THRESH_TRIANGLE,  CONTOURS_MATCH_I1  }  from 'opencv-wasm/opencv.js';
//import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
ipcMain.on('cal_symmetry', (event, rows, columns, pixel_data_16, pixel_data_8) =>
        event.returnValue = cacImgVal.cal_symmetry(rows, columns, pixel_data_16, pixel_data_8)
    )
    //6.3.1 Uniformity of square X-ray irradiation field
ipcMain.on('cal_uniformity', (event, rows, columns, pixel_data_16, pixel_data_8, image_shape) => {
            event.returnValue = cacImgVal.cal_uniformity(rows, columns, pixel_data_16, pixel_data_8, image_shape)
        }

    )
    //6.4.2 Position indication of radiation beam axis on the patient's incident surface
ipcMain.on('cal_position_indication', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape) => {
            event.returnValue = cacImgVal.cal_position_indication(rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape)
        }

    )
    //6.6.2 Zero scale position of rotary motion ruler
ipcMain.on('cal_scale_position', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape) => {
            event.returnValue = cacImgVal.cal_scale_position(rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape)
        }

    )
    //6.3.3 Penumbra of radiation field
ipcMain.on('cal_penumbra', (event, rows, columns, pixel_data_16, pixel_data_8) => {
            event.returnValue = cacImgVal.cal_penumbra(rows, columns, pixel_data_16, pixel_data_8)
        }

    )
    //6.4.1 Digital indication of radiation field(Unit beam limiting)
ipcMain.on('cal_unit_limiting', (event, rows, columns, pixel_data_16, pixel_data_8) => {
            event.returnValue = cacImgVal.cal_unit_limiting(rows, columns, pixel_data_16, pixel_data_8)
        }

    )
    //6.4.1 Digital indication of radiation field(multiple beam limiting :10*10  40 pairs/80 pairs)
ipcMain.on('cal_small_multiple_limiting', (event, rows, columns, pixel_data_16, pixel_data_8, pairs_number) => {
            event.returnValue = cacImgVal.cal_small_multiple_limiting(rows, columns, pixel_data_16, pixel_data_8, pairs_number)
        }

    )
    //6.4.1 Digital indication of radiation field(multiple beam limiting :10*40  40 pairs/80 pairs )
ipcMain.on('cal_large_muliiple_limiting', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, pairs_number, second_pixel_data_16, second_pixel_data_8) => {
            event.returnValue = cacImgVal.cal_large_muliiple_limiting(rows, columns, first_pixel_data_16, first_pixel_data_8, pairs_number, second_pixel_data_16, second_pixel_data_8)
        }

    )
    //6.6.1 Zero scale position of rotary motion ruler
ipcMain.on('cal_photon_position', (event, rows, columns, pixel_data_16, pixel_data_8) => {
            console.log(rows, columns, pixel_data_16, pixel_data_8)
            event.returnValue = cacImgVal.cal_photon_position(rows, columns, pixel_data_16, pixel_data_8)
        }

    )
    //6.5.1 Offset of radiation beam axis relative to isocenter
ipcMain.on('cal_offset', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, third_pixel_data_16, third_pixel_data_8) => {
        console.log(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, third_pixel_data_16, third_pixel_data_8)
        event.returnValue = cacImgVal.cal_offset(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, third_pixel_data_16, third_pixel_data_8)
    })
    //6.7.1-6.7.3 Motion accuracy of treatment bed(6.7.1:vertical,6.7.2:transverse,6.7.3:around)
ipcMain.on('cal_bed_precision', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8) => {
        console.log(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8)
        event.returnValue = cacImgVal.cal_bed_precision(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8)
    })
    //6.3.2 电子线照射野的对称性
ipcMain.on('cal_film_symmetry', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution) => {
        console.log(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution)
        event.returnValue = cacImgVal.cal_film_symmetry(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution)
    })
    //6.3.2 电子线照射野的均整度 （沿两主轴方向上的80%等剂量线 或 沿两主轴方向上的90%等剂量线)
ipcMain.on('cal_film_axisunifo', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution) => {
        console.log(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution)
        event.returnValue = cacImgVal.cal_film_axisunifo(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution)
    })
    //6.3.2 电子线照射野的均整度  (两对角线上90%等剂量线)(percentage:代表百分比，比如百分之90等剂量就传入参数0.9)(resolution:代表tiff格式的分辨率 比如600 就传入参数600)
ipcMain.on('cal_film_diagunifo', (event, rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution) => {
    console.log(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution)
    event.returnValue = cacImgVal.cal_film_diagunifo(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution)
})
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
        width: 1382, //1182
        frame: false,
        minWidth: 1182,
        minHeight: 600,
        resizable: true,
        skipTaskbar: false,
        transparent: false,
        title: "QCS",
        autoHideMenuBar: true,
        backgroundColor: '#000',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            worldSafeExecuteJavaScript: false,
            webSecurity: true,
            nodeIntegrationInWorker: true,
            webviewTag: true,
            enableRemoteModule: true
        },
        x: 0,
        y: 0
    });

    mainWindow.loadURL(winURL)
        //重点在下面这行，开启调试
        //     mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // mainWindow.webContents.openDevTools()
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

ipcMain.on('close', e => {
    mainWindow.close()
})
ipcMain.on('minimize', e => {
    mainWindow.minimize()
})
ipcMain.on('maximize', e => {
    mainWindow.maximize()
})
ipcMain.on('unmaximize', e => {
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