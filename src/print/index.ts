import {ipcMain,IpcMainEvent,IpcMainInvokeEvent, WebContentsPrintOptions,app} from "electron";
import {closeWindow, getPrinterListAsync, translateMM, } from "./util";
import {HtmlConstruct, PdfCreateOptions, PdfReloadOptions} from "./type";
import printPreview from "./printPreview";
    ipcMain.handle('get-printer-list-async',getPrinterListAsync);
    ipcMain.handle("close-pdf-window", closeWindow);

    const print = async (e: IpcMainInvokeEvent, data: any) => {
        const margin = translateMM.toPixels(data.margin)
        const options: WebContentsPrintOptions = {
            silent: data.silent,
            deviceName: data.deviceName,
            pageSize: data.pageSize,
            printBackground: true,
            margins: {
                marginType: "custom",
                top:margin,
                bottom:margin,
                left:margin,
                right:margin
            },
            landscape: !!data.landscape,
            scaleFactor: data.scaleFactor,
        };
        await printPreview.print(options)
    };

    ipcMain.handle("print", print);

   // @ts-ignore
    ipcMain.on('reload-pdf',async (e: IpcMainEvent, reloadOptions: PdfReloadOptions)=>{
        let isToReload: boolean = false;
        if (printPreview.getIsRunning()) {
            console.warn('The instance has been destroyed. Please run it again')
        }
        if ((typeof reloadOptions.isLandscape) !== 'boolean' || printPreview.landscape === reloadOptions.isLandscape) {
            console.info("The current print direction has not changed");
        } else {
            printPreview.landscape = reloadOptions.isLandscape
            isToReload = true;
        }
        if (!reloadOptions.scaleFactor || printPreview.scaleFactor === reloadOptions.scaleFactor) {
            console.info("The current print scaleFactor has not changed");
        } else {
            printPreview.scaleFactor = reloadOptions.scaleFactor
            isToReload = true
        }
        if (!reloadOptions.pageSize || printPreview.pageSize === reloadOptions.pageSize) {
            console.info("The current print pageSize has not changed");
        } else {
            printPreview.pageSize = reloadOptions.pageSize
            isToReload = true
        }
        if (!reloadOptions.margin || printPreview.margin === reloadOptions.margin) {
            console.info("The current print margin has not changed");
        } else {
            printPreview.margin = reloadOptions.margin
            isToReload = true;
        }
        if (!isToReload) {
            console.info("Cancel this processing...");
            return;
        }
        await printPreview.reloadByPrintOptions(e,reloadOptions)
    })

const startPrint:( pdfOptions: PdfCreateOptions,event: IpcMainEvent | undefined,)=>void = printPreview.createPdfWindow.bind(printPreview)
const initPrintPgae:(config: HtmlConstruct)=>void = printPreview.initPage.bind(printPreview)
export {startPrint,initPrintPgae}