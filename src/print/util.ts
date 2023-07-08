import {
    BrowserWindow,
    IpcMainInvokeEvent,
    dialog,
    WebContents,
    PrintToPDFOptions,
    WebContentsPrintOptions, app
} from "electron";
// import {writeFile} from "fs/promises"
import path from "path";
import os from "os";
import {writeFile} from "fs/promises";
import * as fs from "fs";
import {pathToFileURL} from "url";
export const getPrinterListAsync = async (e:IpcMainInvokeEvent) => {
    let retArr = [];
    // @ts-ignore
    let list = await e.sender.getPrintersAsync();
    for (let index in list) {
        retArr.push({
            name: list[index].name,
            isDefault: list[index].isDefault,
        });
    }
    return {
        printDevices: retArr
    }
};

export const closeWindow = (e: IpcMainInvokeEvent) => {
    const targetWin = BrowserWindow.fromWebContents(e.sender)
    targetWin && targetWin.close()
}

/**
 * be like 26dec868-b29f-42e5-9eb6-9c59396ae411
 */
export const uuid = () => {
    // @ts-ignore
    const tempUrl = URL.createObjectURL(new Blob({},{}));
    const uuid = tempUrl.toString();
    URL.revokeObjectURL(tempUrl);
    return uuid.substring(uuid.lastIndexOf("/") + 1)
}

export const generateRandom = () => {
    return Math.random().toString(16).slice(2);
}

export const getBaseUrl = async (webContents: WebContents)=>{
    const res = await webContents.executeJavaScript("document.baseURI")
    return res
}

/**
 * remove @page style
 * @param contens
 */
export const removeAtPageStyle = async (webContents: WebContents): Promise<String> =>{
    const headHtml:string = await webContents.executeJavaScript("document.head.innerHTML")
    let newHeadHtml = headHtml.replaceAll(/@page\s*{[\s\S^}]*?margin[\s\S^}]*?}/g, "");
    // await webContents.executeJavaScript("document.head.innerHTML=" + newHeadHtml)
    return newHeadHtml
}

/***
 * isStyleRendered
 * @param contens
 */
export const isStyleRendered =  async (webContens: WebContents)=> {
    await webContens.executeJavaScript(`document.querySelectorAll('link[rel="stylesheet"]').length==[].slice.call(document.styleSheets).filter(({href})=>href!=null).length`)
    return true
}

let styleRenderedInterval:string | number | NodeJS.Timeout | undefined
export const awaitStyleRendered =  async (webContents: WebContents)=> {
    return new Promise(resolve => {
        styleRenderedInterval =  setInterval(async ()=>{
            const res = await isStyleRendered(webContents)
            if(res){
                // @ts-ignore
                clearInterval(styleRenderedInterval)
                styleRenderedInterval = undefined
                return resolve(true)
            }
        },1000)
    })
}

/**
 * @param webContents
 * @param printToPdfOptions
 */
export const generatePdfFile = async (webContents: WebContents,printToPdfOptions:PrintToPDFOptions)=>{
    await awaitStyleRendered(webContents)
    const pdfPath =  path.join(os.tmpdir(), `j_y_pdf_${generateRandom()}.pdf`)
    const data = await webContents.printToPDF(printToPdfOptions)
    await writeFile(pdfPath,data)
    return pdfPath
}

export const webContentsPrint = (webContens: WebContents,options:WebContentsPrintOptions):Promise<boolean>=>{
    return new Promise(res=>{
        if(!webContens){
            return res(false)
        }
        webContens.print(options, (success: boolean, failureReason: string) => {
            if (success) {
                return res(true)
            }else {
                if(failureReason !== "Print job canceled"){
                    dialog.showErrorBox('print',failureReason)
                }
                return res(false)
            }
        });
    })
}

export const cleanBrowserView = (targetWin: BrowserWindow)=> {
    let v = targetWin.getBrowserView()
    if (v) {
        // @ts-ignore
        v.webContents.destroy()
        targetWin.removeBrowserView(v)
        v = null
    }
}

export const cleanBrowserViews = (targetWin: BrowserWindow)=>{
    let vs = targetWin.getBrowserViews()
    vs.forEach(v => {
        // @ts-ignore
        v.webContents.destroy()
        targetWin.removeBrowserView(v)
    })
}

export const getPdfPreviewUrl =(pdfPath: string)=> {
    return `file:///${pdfPath}#scrollbars=0&toolbar=0&statusbar=0&view=Fit`
}

export const PAGE_SIZES = {
    //纸张自定义尺寸 MM
    custom:{
        width:200,
        height:140
    }
}

export const translateMM = {
    toIches:(number:number)=>{
        return parseFloat((number/25.4).toFixed(2)   )
    },
    toMicorn:(number:number)=>{
        return number*1000
    },
    toPixels:(number:number)=>{
        return parseInt((number/25.4*96).toFixed(2))
    }
}

// chrome 默认页面样式
export const defaultPageStyle =
    ` <style>
        html{
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        }
        body{
        font-family: Microsoft Yahei;
        font-size: 81.25%;
        min-width: min-content !important;
        max-width: 100% !important;
        height: fit-content !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        }
        </style>`;


export const isDevelopment = process.env.NODE_ENV !== 'production'


export const defaultConfigPdfOptions = {
    name: "PdfWindow",
    width: 1000,
    height: 650,
    controlPanelWidth: 370,
    pageSize: "A4",
    landscape: false,
    margin: 10,
    scaleFactor:100
};

export const copyDirectory = (src,target)=>{
    console.log(src,target)
    try {
        fs.accessSync(target)
    }catch (e) {
        console.log(e)
        fs.mkdirSync(target, { recursive: true });
    }
    const files:string[] = fs.readdirSync(src)
    files.forEach((item)=>{
        const source = path.resolve(src, item);
        const dest = path.resolve(target,item)
        const stat = fs.statSync(source)
        if(stat.isFile()){
            fs.copyFileSync(source,dest)
        }else if(stat.isDirectory()){
            fs.mkdirSync(dest, { recursive: true });
            copyDirectory(source,dest)
        }
    })
}

export const print_page = path.resolve(app.getPath("userData"), 'electron-print-preview', `print_page.html`)

export const writeDataToHtml = (filePath,data)=>{
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
    }
    fs.writeFileSync(filePath, data)
}

export const INDEX_PAGE = print_page
export const BLANK_PAGE = 'about:blank'
