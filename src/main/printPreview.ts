import {
    BrowserView,
    BrowserWindow,
    BrowserWindowConstructorOptions,
    ipcMain,
    PrintToPDFOptions,
    WebContents,
    webContents,
    WebContentsPrintOptions
} from "electron";
import {IpcMainEvent} from "electron/main";
import os from 'os'
import fs from 'fs'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
interface PdfCreateOptions {
    /**
     * Currently only inline styles are supported
     */
    htmlString?: string,
    /**
     * The address of the web page you want to generate a pdf
     */
    url?: string,
    /**
     * Standard model or Quirks mode
     * default 怪异模式
     */
    mode?: string
}

interface PdfReloadOptions {
    isLandscape: boolean,
    margin: number,
    pageSize: string
}

interface configPdfOptions {
    /**
     * pdf window name
     */
    name?: string,
    /**
     * pdf window width
     */
    width?: number,
    /**
     * pdf window height
     */
    height?: number,

    /**
     * pdf window right controlPanel width
     */
    controlPanelWidth?: number,

    /**
     * defaultPageSize
     */
    defaultPageSize?: string,
    /**
     * defaultIsLandscape
     */
    defaultIsLandscape?: boolean,
    /**
     * defaultMargin
     */
    defaultMargin?: number,
}

const defaultConfigPdfOptions: configPdfOptions = {
    name: "PdfWindow",
    width: 1000,
    height: 650,
    controlPanelWidth: 370,
    defaultPageSize: "A4",
    defaultIsLandscape: false,
    defaultMargin: 10
};

const bodyStyle = `
        <style>
        html{
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        }
        body{
        /*font-family: Microsoft Yahei;*/
        /*font-size: 81.25%;*/
        min-width: min-content !important;
        max-width: 100% !important;
        height: fit-content !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        }
        </style>
        <style id="print-margin">
        @page  {
        margin: 10mm;
        }
        </style>`;

const initListener = (contents: webContents, that: _Pdf) => {
    const silentPrint = (e: IpcMainEvent, data: any) => {
        const options: WebContentsPrintOptions = {
            silent: true,
            deviceName: data.deviceName,
            pageSize: that.pageSize,
            printBackground: true,
            margins: {
                marginType: "none",
            },
            landscape: that.isLandscape,
            scaleFactor: 100,
        };
        contents.print(options, (success: boolean, failureReason: string) => {
            if (!success) console.debug("silentPrint Error: ", failureReason);
        });
    };

    const getPrinterList = (e: IpcMainEvent) => {
        let retArr = [];
        let list = contents.getPrinters();
        for (let index in list) {
            retArr.push({
                name: list[index].name,
                isDefault: list[index].isDefault,
            });
        }
        isDevelopment && console.debug("getPrinterList", retArr);
        e.reply("get-printer-list-reply", {
            printDevices: retArr,
        });
    };

    const closePdfWindow = (e: IpcMainEvent) => {
        const targetWin = BrowserWindow.fromWebContents(e.sender)
        targetWin && targetWin.close()
    }

    const reloadPdf = (e: IpcMainEvent, data: PdfReloadOptions) => {
        PrintPreview.getIntance().reloadByPrintOptions(e, data)
    }

    ipcMain.on("silent-print", silentPrint);
    ipcMain.on("get-printer-list", getPrinterList);
    ipcMain.on("close-current-window", closePdfWindow);
    ipcMain.on('reload-pdf', reloadPdf)
}
/**
 * be like 26dec868-b29f-42e5-9eb6-9c59396ae411
 */
const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const uuid = tempUrl.toString();
    URL.revokeObjectURL(tempUrl);
    return uuid.substring(uuid.lastIndexOf("/") + 1)
}

const generateRandom = () => {
    return Math.random().toString(16).slice(2);
}
class _Pdf {
    private static readonly blankPage = 'about:blank'
    // "app://./index.html"
    private static readonly indexPage = isDevelopment ? "http://localhost:8080/#/" :path.resolve(__dirname,'index.html')
    pageSize: string;
    isLandscape: boolean;
    private cf: configPdfOptions
    private lastPdfPath = "";
    private pdfPath = "";
    private name?: string
    private win: BrowserWindow | any = null;
    private pdfHandleWin = new BrowserWindow({
        width: 300,
        height: 300,
        show: false,
        frame: false,
        webPreferences: {
            sandbox: true,
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            enableRemoteModule: false,
            minimumFontSize: 12,
            defaultFontFamily: {
                standard: 'Microsoft Yahei'
            }
        },
    })
    private pdfView: BrowserView | any
    private margin: number;
    private printing = false;
    private isPringtingToPdf = false; // 当执行printToPdf方法的时候禁止关闭窗口，否则chrome打印任务会一直报错
    private htmlString?: string;
    private htmlStyle = "";
    private baseUrl = "";

    constructor(config?: configPdfOptions) {
        this.cf = {...config, ...defaultConfigPdfOptions}
        this.pageSize = this.cf.defaultPageSize as string
        this.name = this.cf.name
        this.isLandscape = this.cf.defaultIsLandscape as boolean
        this.margin = this.cf.defaultMargin as number
        initListener(this.pdfHandleWin.webContents, this)
        this.initPdfListener()
    }

    get currentPdfPath() {
        return this.pdfPath;
    }

    set currentPdfPath(path: string) {
        this.lastPdfPath = this.pdfPath;
        this.pdfPath = path;
        if (this.lastPdfPath) {
            fs.unlink(this.lastPdfPath, (err) => {
                if (err) {
                    console.error(err.name);
                }
                return
                this.lastPdfPath = "";
            });
        }
    }

    get setBaseUrl() {
        return `<base href=${this.baseUrl}>`;
    }

    get printToPdfOptions(): PrintToPDFOptions {
        return {
            printBackground: true,
            printSelectionOnly: false,
            landscape: false,
            pageSize: this.isLandscape ? {width: 297 * 1000, height: 210 * 1000} : this.pageSize,
            scaleFactor: 100,
        }
    };

    get pdfViewWidth() {
        return this.cf.width as number - (this.cf.controlPanelWidth as number);
    }

    get pdfViewSize() {
        return {
            x: 0,
            y: 0,
            width: this.pdfViewWidth,
            height: this.win.getBounds().height as number,
        };
    }

    /**
     * remove @page style
     * @param contens
     */
    public static async removePageStyle(contens: WebContents): Promise<boolean> {
        return new Promise((res) => {
            contens.executeJavaScript("document.head.innerHTML").then(async (r) => {
                let htmlStyle = r as string;
                htmlStyle = htmlStyle.replaceAll(/@page\s*{[\s\S^}]*?margin[\s\S^}]*?}/g, "");
                await contens.executeJavaScript("document.head.innerHTML=" + htmlStyle)
                return res(true)
            }).catch(e => {
                console.error(e)
                return res(false)
            });
        })

    }

    /***
     * get WebContents base Url
     * @param contens
     */
    public static async getBaseUrl(contens: WebContents): Promise<string> {
        return new Promise((res, rej) => {
            contens.executeJavaScript("document.baseURI").then((r) => {
                return res(r);
            }).catch(e => {
                console.error(e)
                return res("");
            });
        })
    }

    /***
     * isStyleRendered
     * @param contens
     */
    public static async isStyleRendered(contens: webContents) {
        return new Promise<boolean>(async resolve => {
            try {
                const r = await contens.executeJavaScript(`document.querySelectorAll('link[rel="stylesheet"]').length==[].slice.call(document.styleSheets).filter(({href})=>href!=null).length`)
                return resolve(true)
            } catch (e) {
                console.error(true)
                return resolve(false)
            }
        })
    }

    public static cleanBrowserView(targetWin: BrowserWindow): void {
        let v = targetWin.getBrowserView()
        if (v) {
            // @ts-ignore
            v.webContents.destroy()
            targetWin.removeBrowserView(v)
            v = null
        }
    }

    public static cleanBrowserViews(targetWin: BrowserWindow): void {
        let vs = targetWin.getBrowserViews()
        vs.forEach(v => {
            // @ts-ignore
            v.webContents.destroy()
            targetWin.removeBrowserView(v)
        })
    }

    public static getPdfUrl(pdfPath: string) {
        return `file:///${pdfPath}#scrollbars=0&toolbar=0&statusbar=0&view=Fit`
    }

    public static getTmpPdfPath() {
        return path.join(os.tmpdir(), `j_y_pdf_${generateRandom()}.pdf`)
    }

    clean() {
        this.pageSize = this.cf.defaultPageSize as string;
        this.isLandscape = this.cf.defaultIsLandscape as boolean;
        this.margin = this.cf.defaultMargin as number;
        const cp = new Set([this.lastPdfPath, this.pdfPath])
        cp.forEach((_p => {
            fs.unlink(_p, (err) => {
                if (err) {
                    console.error(err.name);
                }
                return;
            });
        }))
        this.lastPdfPath = ""
        this.pdfPath = "";
    }

    /***
     * before current window close , set it is null
     */
    initPdfView(attachedWin: BrowserWindow) {
        this.pdfView = new BrowserView({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: true,
            },
        })
        this.pdfView.setAutoResize({
            width: false,
            height: false,
        });
        this.pdfView.webContents.on("page-title-updated", () => {
            // If the loaded pdf file is too large, a black screen will be displayed after the page-title is updated
            attachedWin.setBrowserView(this.pdfView);
            //BrowserView.setBounds must be called after BrowserWindow.addBrowserView
            this.pdfView.setBounds(this.pdfViewSize);
        });
    }


    reloadByPrintOptions(event: IpcMainEvent, reloadOptions: PdfReloadOptions
    ) {
        let isToReload: boolean = false;
        if (!(this.win && this.pdfHandleWin && this.pdfView && this.htmlString)) {
            console.warn('The instance has been destroyed. Please run it again')
        }
        if (this.isLandscape === reloadOptions.isLandscape) {
            console.info("The current print direction has not changed");
        } else {
            this.isLandscape = reloadOptions.isLandscape;
            isToReload = true;
        }
        if (this.margin === reloadOptions.margin) {
            console.info("The current print margin has not changed");
        } else {
            // If the print margin changes, add a body margin style to simulate the print code office
            isToReload = true;
            this.margin = reloadOptions.margin;
            this.pdfHandleWin.webContents.executeJavaScript(
                `document.querySelector('#print-margin').innerHTML = document.querySelector('#print-margin').innerHTML.replace(/(?<=(margin[\\s]*?:[\\s]*?))\\d+/g,${this.margin})`)
                .then(_ => true)
        }

        if (!isToReload) {
            console.info("Cancel this processing...");
            return;
        }
        this.win.removeBrowserView(this.pdfView);
        this.pdfView.setBounds(this.pdfViewSize);
        this.generatePdfFile();
    }

    /**
     * display pdf window
     * @param event
     * @param pdfOptions
     */
    public createPdfWindow(event: IpcMainEvent | undefined, pdfOptions: PdfCreateOptions) {
        this.htmlString = pdfOptions.htmlString;
        const parentWindow = BrowserWindow.getFocusedWindow();
        let winOptions: BrowserWindowConstructorOptions = {
            width: this.cf.width,
            height: this.cf.height,
            show: false,
            center: true,
            frame: false,
            hasShadow: false,
            resizable: false,
            movable: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: false,
                preload: path.join(__dirname, "preload.js"),
            },
        };
        if (parentWindow) {
            winOptions.parent = parentWindow;
            winOptions.modal = true;
        }
        this.win = new BrowserWindow(winOptions);
        this.initPdfView(this.win);
        this.win.once("ready-to-show", () => {
            this.win.show();
        });
        this.win.webContents.once('dom-ready', () => {
            // Trigger printing
            console.info('printing')
            this.pdfHandleWin.loadURL(_Pdf.blankPage);

        })
        this.win.once('close', () => {
            console.info("PdfWindow is closing");
        })
        this.win.once("closed", () => {
            this.win = null;
            this.printing = false
            this.clean()
        });
        this.win.loadURL(_Pdf.indexPage);
    }

    private initPdfListener() {

        this.pdfHandleWin.webContents.on("dom-ready", async () => {
            await this.pdfHandleWin.webContents.executeJavaScript(
                "document.body.innerHTML=`" +
                this.htmlString +
                "`;document.head.innerHTML=`" +
                this.setBaseUrl +
                this.htmlStyle +
                bodyStyle +
                '`;document.title="";'
            )
            this.generatePdfFile()
        });
        this.pdfHandleWin.on("closed", () => {
            // this.destroy();
            if (this.win) {
                this.win.close();
            }
            if (!this.printing && this.pdfHandleWin) {
                this.pdfHandleWin.close();
            }
        });

    }

    private generatePdfFile() {
        const pdfPath = _Pdf.getTmpPdfPath()
        this.currentPdfPath = pdfPath;
        this.isPringtingToPdf = true;
        this.pdfHandleWin.webContents.printToPDF(this.printToPdfOptions)
            .then((data: any) => {
                fs.writeFile(pdfPath, data, (error) => {
                    if (error) throw error;
                    isDevelopment && console.info(`Wrote PDF successfully to ${pdfPath}`);
                    this.pdfView.webContents.loadURL(_Pdf.getPdfUrl(pdfPath));
                });
            })
            .catch((error: Error) => {
                console.error(`Failed to write PDF to ${pdfPath}: `, error);
            })
            .finally(() => {
                this.isPringtingToPdf = false;

            });
    }
}

class PrintPreview {
    private static _p: _Pdf | null = null

    public static getIntance() {
        if (!PrintPreview._p) {
            PrintPreview._p = new _Pdf()
        }
        return PrintPreview._p
    }

}

export default PrintPreview
