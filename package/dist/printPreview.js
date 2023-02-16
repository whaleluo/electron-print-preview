(()=>{"use strict";var e={n:t=>{var i=t&&t.__esModule?()=>t.default:()=>t;return e.d(i,{a:i}),i},d:(t,i)=>{for(var n in i)e.o(i,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:i[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{default:()=>p});const i=require("electron"),n=require("os");var s=e.n(n);const r=require("fs");var a=e.n(r);const o=require("path");var d=e.n(o);const h={name:"PdfWindow",width:1e3,height:650,controlPanelWidth:370,defaultPageSize:"A4",defaultIsLandscape:!1,defaultMargin:10};class l{constructor(e){var t,n;this.lastPdfPath="",this.pdfPath="",this.win=null,this.pdfHandleWin=new i.BrowserWindow({width:300,height:300,show:!1,frame:!1,webPreferences:{sandbox:!0,nodeIntegration:!1,contextIsolation:!0,webSecurity:!1,enableRemoteModule:!1,minimumFontSize:12,defaultFontFamily:{standard:"Microsoft Yahei"}}}),this.printing=!1,this.isPringtingToPdf=!1,this.htmlStyle="",this.baseUrl="",this.cf={...e,...h},this.pageSize=this.cf.defaultPageSize,this.name=this.cf.name,this.isLandscape=this.cf.defaultIsLandscape,this.margin=this.cf.defaultMargin,t=this.pdfHandleWin.webContents,n=this,i.ipcMain.on("silent-print",((e,i)=>{const s={silent:!0,deviceName:i.deviceName,pageSize:n.pageSize,printBackground:!0,margins:{marginType:"none"},landscape:n.isLandscape,scaleFactor:100};t.print(s,((e,t)=>{e||console.debug("silentPrint Error: ",t)}))})),i.ipcMain.on("get-printer-list",(e=>{let i=[],n=t.getPrinters();for(let e in n)i.push({name:n[e].name,isDefault:n[e].isDefault});e.reply("get-printer-list-reply",{printDevices:i})})),i.ipcMain.on("close-current-window",(e=>{const t=i.BrowserWindow.fromWebContents(e.sender);t&&t.close()})),i.ipcMain.on("reload-pdf",((e,t)=>{c.getIntance().reloadByPrintOptions(e,t)})),this.initPdfListener()}get currentPdfPath(){return this.pdfPath}set currentPdfPath(e){this.lastPdfPath=this.pdfPath,this.pdfPath=e,this.lastPdfPath&&a().unlink(this.lastPdfPath,(e=>{e&&console.error(e.name)}))}get setBaseUrl(){return`<base href=${this.baseUrl}>`}get printToPdfOptions(){return{printBackground:!0,printSelectionOnly:!1,landscape:!1,pageSize:this.isLandscape?{width:297e3,height:21e4}:this.pageSize,scaleFactor:100}}get pdfViewWidth(){return this.cf.width-this.cf.controlPanelWidth}get pdfViewSize(){return{x:0,y:0,width:this.pdfViewWidth,height:this.win.getBounds().height}}static async removePageStyle(e){return new Promise((t=>{e.executeJavaScript("document.head.innerHTML").then((async i=>{let n=i;return n=n.replaceAll(/@page\s*{[\s\S^}]*?margin[\s\S^}]*?}/g,""),await e.executeJavaScript("document.head.innerHTML="+n),t(!0)})).catch((e=>(console.error(e),t(!1))))}))}static async getBaseUrl(e){return new Promise(((t,i)=>{e.executeJavaScript("document.baseURI").then((e=>t(e))).catch((e=>(console.error(e),t(""))))}))}static async isStyleRendered(e){return new Promise((async t=>{try{return await e.executeJavaScript("document.querySelectorAll('link[rel=\"stylesheet\"]').length==[].slice.call(document.styleSheets).filter(({href})=>href!=null).length"),t(!0)}catch(e){return console.error(!0),t(!1)}}))}static cleanBrowserView(e){let t=e.getBrowserView();t&&(t.webContents.destroy(),e.removeBrowserView(t),t=null)}static cleanBrowserViews(e){e.getBrowserViews().forEach((t=>{t.webContents.destroy(),e.removeBrowserView(t)}))}static getPdfUrl(e){return`file:///${e}#scrollbars=0&toolbar=0&statusbar=0&view=Fit`}static getTmpPdfPath(){return d().join(s().tmpdir(),`j_y_pdf_${Math.random().toString(16).slice(2)}.pdf`)}clean(){this.pageSize=this.cf.defaultPageSize,this.isLandscape=this.cf.defaultIsLandscape,this.margin=this.cf.defaultMargin,new Set([this.lastPdfPath,this.pdfPath]).forEach((e=>{a().unlink(e,(e=>{e&&console.error(e.name)}))})),this.lastPdfPath="",this.pdfPath=""}initPdfView(e){this.pdfView=new i.BrowserView({webPreferences:{nodeIntegration:!1,contextIsolation:!0,webSecurity:!0}}),this.pdfView.setAutoResize({width:!1,height:!1}),this.pdfView.webContents.on("page-title-updated",(()=>{e.setBrowserView(this.pdfView),this.pdfView.setBounds(this.pdfViewSize)}))}reloadByPrintOptions(e,t){let i=!1;this.win&&this.pdfHandleWin&&this.pdfView&&this.htmlString||console.warn("The instance has been destroyed. Please run it again"),this.isLandscape===t.isLandscape?console.info("The current print direction has not changed"):(this.isLandscape=t.isLandscape,i=!0),this.margin===t.margin?console.info("The current print margin has not changed"):(i=!0,this.margin=t.margin,this.pdfHandleWin.webContents.executeJavaScript(`document.querySelector('#print-margin').innerHTML = document.querySelector('#print-margin').innerHTML.replace(/(?<=(margin[\\s]*?:[\\s]*?))\\d+/g,${this.margin})`).then((e=>!0))),i?(this.win.removeBrowserView(this.pdfView),this.pdfView.setBounds(this.pdfViewSize),this.generatePdfFile()):console.info("Cancel this processing...")}createPdfWindow(e,t){this.htmlString=t.htmlString;const n=i.BrowserWindow.getFocusedWindow();let s={width:this.cf.width,height:this.cf.height,show:!1,center:!0,frame:!1,hasShadow:!1,resizable:!1,movable:!0,webPreferences:{nodeIntegration:!1,contextIsolation:!0,webSecurity:!1,preload:d().join(__dirname,"preload.js")}};n&&(s.parent=n,s.modal=!0),this.win=new i.BrowserWindow(s),this.initPdfView(this.win),this.win.once("ready-to-show",(()=>{this.win.show()})),this.win.webContents.once("dom-ready",(()=>{console.info("printing"),this.pdfHandleWin.loadURL(l.blankPage)})),this.win.once("close",(()=>{console.info("PdfWindow is closing")})),this.win.once("closed",(()=>{this.win=null,this.printing=!1,this.clean()})),this.win.loadURL(l.indexPage)}initPdfListener(){this.pdfHandleWin.webContents.on("dom-ready",(async()=>{await this.pdfHandleWin.webContents.executeJavaScript("document.body.innerHTML=`"+this.htmlString+"`;document.head.innerHTML=`"+this.setBaseUrl+this.htmlStyle+'\n        <style>\n        html{\n        width: 100% !important;\n        height: 100% !important;\n        padding: 0 !important;\n        margin: 0 !important;\n        box-sizing: border-box !important;\n        }\n        body{\n        /*font-family: Microsoft Yahei;*/\n        /*font-size: 81.25%;*/\n        min-width: min-content !important;\n        max-width: 100% !important;\n        height: fit-content !important;\n        padding: 0 !important;\n        margin: 0 !important;\n        box-sizing: border-box !important;\n        }\n        </style>\n        <style id="print-margin">\n        @page  {\n        margin: 10mm;\n        }\n        </style>`;document.title="";'),this.generatePdfFile()})),this.pdfHandleWin.on("closed",(()=>{this.win&&this.win.close(),!this.printing&&this.pdfHandleWin&&this.pdfHandleWin.close()}))}generatePdfFile(){const e=l.getTmpPdfPath();this.currentPdfPath=e,this.isPringtingToPdf=!0,this.pdfHandleWin.webContents.printToPDF(this.printToPdfOptions).then((t=>{a().writeFile(e,t,(t=>{if(t)throw t;this.pdfView.webContents.loadURL(l.getPdfUrl(e))}))})).catch((t=>{console.error(`Failed to write PDF to ${e}: `,t)})).finally((()=>{this.isPringtingToPdf=!1}))}}l.blankPage="about:blank",l.indexPage=d().resolve(__dirname,"index.html");class c{static getIntance(){return c._p||(c._p=new l),c._p}}c._p=null;const p=c;exports.printPreview=t})();