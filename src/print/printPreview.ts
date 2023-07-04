import { BrowserView, BrowserWindow, BrowserWindowConstructorOptions,PrintToPDFOptions,IpcMainEvent,WebContentsPrintOptions,dialog} from "electron";
import {
    generatePdfFile,
    getPdfPreviewUrl,
    defaultPageStyle,
    defaultConfigPdfOptions,
    BLANK_PAGE,
    INDEX_PAGE,
    PAGE_SIZES, translateMM, getBaseUrl, removeAtPageStyle, webContentsPrint
} from './putil'
import {PdfCreateOptions, PdfReloadOptions} from "./ptype";
const initPage = require('./initPage')
initPage()

class _Pdf {
    public pageSize: string;
    public landscape: boolean;
    public scaleFactor: number;
    public margin: number;
    public htmlString?: string;
    // 当执行printToPdf方法的时候禁止关闭窗口，否则chrome打印任务会一直报错
    private isPrintingToPdf = false;
    private isPrinting = false
    private pdfWin: BrowserWindow | any = null;
    private pdfView: BrowserView | any = null
    private handleWin: BrowserWindow | any = null;

    constructor() {
        this.pageSize = defaultConfigPdfOptions.pageSize
        this.landscape = defaultConfigPdfOptions.landscape
        this.margin = defaultConfigPdfOptions.margin
        this.scaleFactor = defaultConfigPdfOptions.scaleFactor
    }

    getPrintToPdfOptions(): PrintToPDFOptions {
        let pageSize = this.pageSize
        // @ts-ignore
        if (PAGE_SIZES[this.pageSize]) {
            // @ts-ignore
            pageSize = PAGE_SIZES[this.pageSize]
        }
        const margin = translateMM.toIches(this.margin)
        return {
            printBackground: true,
            landscape: this.landscape,
            pageSize,
            // @ts-ignore
            scale: this.scaleFactor/100,
            margins: {
                top: margin,
                bottom: margin,
                left: margin,
                right: margin
            }
        }
    };
    public getIsRunning(){
        return !(this.pdfWin && this.handleWin) || this.isPrintingToPdf || this.isPrinting
    }
    private getPdfViewSize() {
        return {
            x: 0,
            y: 0,
            width: defaultConfigPdfOptions.width - defaultConfigPdfOptions.controlPanelWidth,
            height: this.pdfWin.getBounds().height,
        };
    }

    private clean() {
        this.pageSize = defaultConfigPdfOptions.pageSize
        this.landscape = defaultConfigPdfOptions.landscape
        this.margin = defaultConfigPdfOptions.margin
        this.scaleFactor = defaultConfigPdfOptions.scaleFactor
        this.htmlString = ''
    }

    public async reloadByPrintOptions(event: IpcMainEvent, reloadOptions: PdfReloadOptions ) {

        this.pdfWin.removeBrowserView(this.pdfView);
        await this.generatePdfAndReload()
        // this.pdfView.setBounds(this.pdfViewSize);
    }

    async print(options:WebContentsPrintOptions){
        this.isPrinting = true
        this.pdfWin.close()
        await webContentsPrint(this.handleWin.webContents,options)
        this.isPrinting = false
        this.handleWin.close()
    }

    /**
     * display pdf window
     * @param event
     * @param pdfOptions
     */
    public createPdfWindow(pdfOptions: PdfCreateOptions, event: IpcMainEvent | undefined) {
        this.htmlString = pdfOptions.htmlString;
        // We cannot require the screen module until the app is ready.
        // Create a window that fills the screen's available work area.
        // const primaryDisplay = screen.getPrimaryDisplay()
        // const { width, height } = primaryDisplay.workAreaSize //1920 1040
        // console.log(width,height)
        //The bottom toolbar is not included at win
        this.createPdfHandleWin()

        const parentWindow = BrowserWindow.getFocusedWindow();
        let winOptions: BrowserWindowConstructorOptions = {
            width: defaultConfigPdfOptions.width,
            height: defaultConfigPdfOptions.height,
            show: false,
            center: true,
            frame: false,
            hasShadow: false,
            resizable: true,
            movable: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity:false
            },
        };
        if (parentWindow) {
            winOptions.parent = parentWindow;
            winOptions.modal = true;
        }
        this.pdfWin = new BrowserWindow(winOptions);
        this.pdfWin.once('ready-to-show',()=>{
            this.pdfWin.show()
            this.pdfWin.webContents.openDevTools()
        })
        //before current window close , set it is null
        this.pdfView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        })
        this.pdfView.setAutoResize({
            width: false,
            height: false,
        });
        this.pdfView.webContents.on("page-title-updated", () => {
            // If the loaded pdf file is too large, a black screen will be displayed after the page-title is updated
            this.pdfWin?.setBrowserView(this.pdfView);
            //BrowserView.setBounds must be called after BrowserWindow.addBrowserView
            this.pdfView?.setBounds(this.getPdfViewSize());
        });


        this.pdfWin.webContents.once('dom-ready', async () => {
            await this.handleWin.loadURL(BLANK_PAGE);
        })
        this.pdfWin.once('close', () => {
            console.info("PdfWindow is closing");
        })
        this.pdfWin.once("closed", () => {
            this.pdfWin = null;
            this.pdfView = null
            if(!(this.isPrintingToPdf || this.isPrinting) ){
                this.handleWin.close()
            }
        });
        this.pdfWin.loadURL(INDEX_PAGE);
        // this.win.webContents.openDevTools()
    }

    private createPdfHandleWin() {
        this.handleWin = new BrowserWindow({
            width: 300,
            height: 300,
            show: false,
            frame: false,
            transparent:true,
            webPreferences: {
                sandbox: true,
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
                minimumFontSize: 12,
                defaultFontFamily: {
                    standard: 'Microsoft Yauheni'
                }
            },
        })
        // 当transparent:true, 窗口背景色可以包含透明度
        // this.handleWin.setBackgroundColor('#000000') 透明
        // this.handleWin.setBackgroundColor('#11FFFFF') 白色背景，
        this.handleWin.webContents.on("dom-ready", async () => {
            // const baseUrl = await getBaseUrl(this.handleWin.webContents)
            // const htmlStyle = await removeAtPageStyle(this.handleWin.webContents)
            await this.handleWin.webContents.executeJavaScript(
                "document.body.innerHTML=`" +
                this.htmlString +
                "`;document.head.innerHTML=`" +
                // `<base href=${baseUrl}>` +
                // htmlStyle +
                defaultPageStyle +
                '`;document.title="";'
            )
            await this.generatePdfAndReload()

        });
        this.handleWin.on("closed", () => {
            this.handleWin = null
            this.clean()
            this.pdfWin?.close()

        });
    }

    private generatePdfAndReload= async ()=>{
        let errMessage = 'pdf transform failed, please restart app !'
        try {
            this.isPrintingToPdf = true
            const pdfPath = await generatePdfFile(this.handleWin.webContents, this.getPrintToPdfOptions())
            this.isPrintingToPdf = false
            errMessage = 'pdf loading failed, please retry !'
            await this.pdfView.webContents.loadURL(getPdfPreviewUrl(pdfPath));
            errMessage = ''
        }catch (e) {
            console.error(e)
            dialog.showMessageBox(null, {message:errMessage})
        }finally {
            // chyui window is closed
            if(!errMessage){
                this.pdfWin?.webContents.send('ready', true)
            }
            if(!this.pdfWin){
                this.handleWin.close()
            }
        }
    }
}

const printPreview = new _Pdf()

export default printPreview
