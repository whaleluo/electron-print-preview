'use strict';
import {ipcMain, app, BrowserWindow, IpcMainEvent} from "electron";
const {startPrint} = require("./print");
import path from "path";
import fs from "fs";
import {pathToFileURL} from "url";

const examplePage = path.resolve(app.getPath("userData"), 'electron-print-preview', 'example.html')
const exampleDirname = path.dirname(examplePage);
if (!fs.existsSync(exampleDirname)) {
    fs.mkdirSync(exampleDirname, {recursive: true})
}
fs.writeFileSync(examplePage, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        div{
            margin: 10px;
        }
    </style>
    <title>PDF print demo</title>
</head>
<body style="background-color: white">
<div>
    <button id="print">打印HTML内容</button>
</div>
<div>
    <label for="story" style="display: block;">请输入要打印的html:</label>
    <textarea id="story" name="story" rows="5" cols="33" style="font-size: 17px"><div style="color: cornflowerblue;font-size: 22px">hello world</div></textarea>
</div>
</body>
<script>
    const {ipcRenderer} = require("electron")

    const btn = document.getElementById('print')
    const txt = document.getElementById('story')
    btn.addEventListener('click',()=>{
        const v = txt.value.trim()
        ipcRenderer.invoke('startPrint',v)
    })
</script>
</html>
`)

var example = {};


function createWindow() {

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(pathToFileURL(examplePage).href);

    ipcMain.handle('startPrint', async (e: IpcMainEvent, html: string) => {
        startPrint({htmlString: html}, e)
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

module.exports = example;
