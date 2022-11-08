import {contextBridge, ipcRenderer} from 'electron'
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// can use whitelist channels
// let validChannels = ['toMain','']
// if (validChannels.includes(channel)) {
//   return ipcRenderer.sendSync(channel, data)
// }
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel:string, data:any) => {
        ipcRenderer.send(channel, data)
    },
    sendSync: (channel:string, data:any) => {
        return ipcRenderer.sendSync(channel, data)
    },
    /***
     * @param webContentsId send to a page not to main process
     * @param channel
     * @param args
     */
    sendTo(webContentsId:number, channel:string, ...args:any[]) {
        return ipcRenderer.sendTo(webContentsId, channel, ...args)
    },
    invoke: (channel:string, data:any) => {
        return ipcRenderer.invoke(channel, data)
    },
    on: (channel:string, func:Function) => {
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
    },
    removeAllListeners: (channel:string) => {
        ipcRenderer.removeAllListeners(channel)
    }
})