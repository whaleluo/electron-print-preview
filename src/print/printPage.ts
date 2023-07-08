import {HtmlConstruct} from "./type";
export default function (config: HtmlConstruct = {style: "", script: ""}) {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>打印</title>
                <style>
                    .style_display_block {
                        display: block !important;
                    }
            
                    .style_display_none {
                        display: none !important;
                    }
            
                    html,
                    body,
                    #app,
                    body,
                    .container,
                    .options {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        -webkit-app-region: no-drag;
                    }
            
                    button,
                    input,
                    select,
                    a {
                        -webkit-app-region: no-drag;
                    }
            
                    body {
                        background-color: #53575aff;
                        font-family: Roboto, "Segoe UI", Arial, "Microsoft Yahei", sans-serif;
                        font-size: 81.25%;
                    }
            
                    .container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                    }
            
                    iframe {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        display: flex;
                        border-sizing: border-box;
                    }
            
                    .container-loading {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        border-right: solid 2px white;
                    }
            
                    .loader {
                        color: white;
                    }
            
                    .loader span {
                        margin: 1px;
                        display: inline-block;
                        position: relative;
                    }
            
                    .loader .dot-1 {
                        animation: anim 0.5s linear 0.1s infinite;
                    }
            
                    .loader .dot-2 {
                        animation: anim 0.5s linear 0.25s infinite;
                    }
            
                    .loader .dot-3 {
                        animation: anim 0.5s linear 0.5s infinite;
                    }
            
                    .loader .dot-4 {
                        animation: anim 0.5s linear 0.75s infinite;
                    }
            
                    @keyframes anim {
                        0% {
                            bottom: 0;
                        }
            
                        50% {
                            bottom: 0.8rem;
                        }
            
                        100% {
                            bottom: 0;
                        }
                    }
            
                    .options {
                        background-color: rgb(248, 249, 250);
                        padding: 30px;
                        width: 370px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        position: relative;
                        -webkit-app-region: drag;
                    }
            
                    .options .title {
                        font-size: calc(16 / 13 * 1rem);
                        font-weight: 400;
                    }
            
                    .printOptions>div {
                        display: flex;
                        margin: 15px 0;
                    }
            
                    .printOptions select,
                    .printOptions input {
                        width: 200px;
                        min-width: 200px;
                        height: 33px;
                        border: none;
                        border-radius: 5px;
                        outline-color: rgb(26, 115, 232);
                        background-color: rgb(241, 243, 244);
                        -webkit-app-region: no-drag;
                        z-index: 999;
                    }
            
                    .printOptions span {
                        width: 120px;
                        display: flex;
                        align-items: center;
                    }
            
                    .btn {
                        position: absolute;
                        width: 100%;
                        bottom: 15px;
                        right: 10px;
                        display: flex;
                        justify-content: flex-end;
                    }
            
                    .btn button {
                        cursor: pointer;
                        background-color: rgb(26, 115, 232);
                        color: rgb(255, 255, 255);
                        border: none;
                        margin-right: 15px;
                        line-height: 28px;
                        width: 66px;
                        border-radius: 5px;
                    }
            
                    .btn>button:nth-child(2) {
                        color: rgb(26, 115, 232);
                        background-color: rgb(255, 255, 255);
                        border: solid 1px rgb(26, 115, 232);
                        box-sizing: border-box;
                    }
            
                    .print-margin-option {
                        justify-content: flex-end;
                    }
            
                    .print-margin-container {
                        display: flex;
                        flex-direction: column;
                        width: 200px;
                        min-width: 200px;
                    }
            
                    .printOptions input[type="number"] {
                        color: black;
                        padding-inline-end: 0;
                        width: 34px;
                        height: 22px;
                    }
            
                    .printOptions input[type="number"][disabled] {
                        color: gray;
                        padding-inline-end: 0;
                        width: 34px;
                        height: 22px;
                    }
            
                    .printOptions input[type="number"]::-webkit-inner-spin-button,
                    .printOptions input[type="number"]::-webkit-inner-spin-button {
                        appearance: none;
                        margin: 0;
                    }
            
                    .print-margin {
                        display: flex;
                    }
            
                    .print-margin .top,
                    .print-margin .bottom {
                        justify-content: center;
                    }
            
                    .print-margin .middle {
                        justify-content: space-between;
                    }
            
                    .input-margin {
                        display: inline-flex;
                        border-radius: 4px;
                        overflow: hidden;
                    }
            
                    .input-margin span {
                        width: fit-content;
                        color: white;
                        background-color: black;
                        font-size: 87%;
                    }
                    .sys-print button{
                        border: none;
                        cursor: pointer;
                        visibility: hidden;        
                    }
                </style>
                <style>
                ${config.style}
                </style>
            </head>
            
            <body>
                <div id="app">
                    <div class="container">
                        <iframe></iframe>
                        <div class="container-loading">
                            <div class="loader">
                                正在加载预览
                                <span class="dot dot-1">.</span>
                                <span class="dot dot-2">.</span>
                                <span class="dot dot-3">.</span>
                            </div>
                        </div>
                        <div class="options">
                            <div class="headerContainer">
                                <h1 class="title">打印</h1>
                            </div>
                            <div class="printOptions">
                                <div>
                                    <span>目标打印机</span>
                                    <select class="printers devices"
                                        onchange="changePrintDevice(this.options[this.selectedIndex].value)"></select>
                                </div>
                                <div>
                                    <span>布局</span>
                                    <select class="layout devices" name="layout" disabled="true"
                                        onchange="changeSelectedLayout(this.options[this.selectedIndex].value)">
                                        <option value="portrait" selected>纵向</option>
                                        <option value="landscape">横向</option>
                                    </select>
                                </div>
                                <div>
                                    <span>边距</span>
                                    <select onchange="changeSelectedMargin(this.options[this.selectedIndex].value)"
                                        class="printerMargin devices" disabled="true">
                                        <option value="10">默认</option>
                                        <option value="0">无</option>
                                    </select>
                                </div>
                                <div>
                                    <span>纸张尺寸</span>
                                    <select onchange="changeSelectedPageSize(this.options[this.selectedIndex].value)"
                                        class="printerSize devices" disabled="true"></select>
                                </div>
                                <div>
                                    <span>缩放</span>
                                    <input type="number" class="printScale devices" oninput="debounceScale(this.value)"
                                        disabled="false" />
                                </div>
                                <div class="sys-print">
                                    <button onclick="printTwo(false)" disabled="false">
                                        使用系统对话框打印
                                    </button>
                                </div>
                            </div>
                            <div class="btn">
                                <button class="print" onclick="printTwo(true)">打印</button>
                                <button class="cancel" onclick="cancel()">取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            <script>
                const { ipcRenderer } = require("electron")
                const style_display_block = "style_display_block"
                const style_display_none = "style_display_none"
                const iframe = document.querySelector("iframe")
                const loading = document.querySelector(".container-loading")
            
                const printerDevices = document.querySelector('.printers')
                const layout = document.querySelector(".layout")
                const printerMargin = document.querySelector(".printerMargin")
                const printerSize = document.querySelector(".printerSize")
                const printScale = document.querySelector(".printScale")
                const sysPrintBtn = document.querySelector(".sys-print button")
                const data = {
                    printDevices: [],
                    selectedPrintDevices: "",
                    selectedLayout: "portrait",
                    selectedBackColor: "none",
                    selectedMargin: "10",
                    selectedPageSize: 'A4',
                    selectedScaleFactor: 100,
                    pageSize: ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'],
                    scaleTimeout: '',
                    ready: false,
                    pdfUrl: ''
                }
                const proxy = new Proxy(data, {
                    get: (target, propkey) => {
                        return target[propkey];
                    },
                    set: (target, propkey, value) => {
                        console.log(target, propkey, value)
                        if (target[propkey] === value) {
                            return false
                        }
                        target[propkey] = value
                        if (propkey === "selectedLayout") {
                            console.log('the printing direction is changed', value)
                            ipcRenderer.send('reload-pdf', {
                                isLandscape: value == "landscape" ? true : false,
                            })
                        }
                        if (propkey === "selectedMargin") {
                            console.log('the printing magrin is changed', value)
                            ipcRenderer.send('reload-pdf', {
                                margin: value,
                            })
                        }
                        if (propkey === "selectedPageSize") {
                            console.log('the printing pageSize is changed', value)
                            ipcRenderer.send('reload-pdf', {
                                pageSize: value
                            })
                        }
            
                        if (propkey === "selectedScaleFactor") {
                            console.log('the printing scaleFactor is changed', value)
                            ipcRenderer.send('reload-pdf', {
                                scaleFactor: value
                            })
                        }
                        if (propkey === "ready") {
                            if (value) {
                                iframe.classList.remove(style_display_none)
                                loading.classList.add(style_display_none)
                                layout.disabled = false
                                printerDevices.disabled = false
                                printerMargin.disabled = false
                                printerSize.disabled = false
                                printScale.disabled = false
                                sysPrintBtn.disabled = false
                            } else {
                                iframe.classList.add(style_display_none)
                                loading.classList.remove(style_display_none)
                                layout.disabled = true
                                printerDevices.disabled = true
                                printerMargin.disabled = true
                                printerSize.disabled = true
                                printScale.disabled = true
                                sysPrintBtn.disabled = true
                                iframe.src = ""
                            }
                        }
                        if (propkey === "pdfUrl") {
                            iframe.src = value
                        }
            
                        return true;
                    }
                })
            
                for (let index = 1; index < 9; index++) {
                    printerMargin.add(new Option(index + "mm", index))
            
                }
                iframe.classList.add(style_display_none)
            
                proxy.pageSize.forEach(item => {
                    let defaultSelected = false
                    if (item === 'A4') {
                        defaultSelected = true
                    }
                    printerSize.add(new Option(item, item, defaultSelected, defaultSelected))
                })
                printScale.value = proxy.selectedScaleFactor
            
            
            
                ipcRenderer.on('ready', (e, args) => {
                    console.log(e, args)
                    proxy.pdfUrl = args.url
                    proxy.ready = true
                })
                ipcRenderer.invoke("get-printer-list-async").then(data => {
                    console.log("get-printer-list-async", data);
                    const arr = data.printDevices.reverse();
                    arr.forEach(printer => {
                        if (printer.isDefault) {
                            printerDevices.add(new Option(printer.name, printer.name, true, true))
                            proxy.selectedPrintDevices = printer.name
            
                        } else {
                            printerDevices.add(new Option(printer.name, printer.name))
            
                        }
                    });
                })
            
                function changeSelectedLayout(value) {
                    proxy.ready = false
                    proxy.selectedLayout = value
                }
                function changeSelectedMargin(value) {
                    proxy.ready = false
                    proxy.selectedMargin = value
                }
                function changeSelectedPageSize(value) {
                    proxy.ready = false
                    proxy.selectedPageSize = value
                }
                function changeScale(value) {
                    console.log(value)
                    proxy.ready = false
                    proxy.selectedScaleFactor = value
                }
            
                async function printTwo(silent = true) {
                    if (!proxy.selectedPrintDevices) {
                        alert('Please select a printer !')
                        return
                    }
                    await ipcRenderer.invoke("print", {
                        silent: silent,
                        deviceName: proxy.selectedPrintDevices,
                        pageSize: proxy.selectedPageSize,
                        printBackground: proxy.selectedBackColor,
                        margin: proxy.selectedMargin,
                        landscape: proxy.selectedLayout === "landscape" ? true : false,
                        scaleFactor: proxy.selectedScaleFactor
                    });
                }
                function cancel() {
                    ipcRenderer.invoke("close-pdf-window")
                }
                function changePrintDevice(value) {
                    proxy.selectedPrintDevices = value
            
                }
                function debounce(fn, wait) {
                    let time;
                    return function (...args) {
                        if (time) {
                            clearTimeout(time);
                        };
                        time = setTimeout(function () {
                            fn(...args);
                        }, wait);
                    }
                }
                const _debounceScale = debounce(changeScale, 1500)
                function debounceScale(value) {
                    return _debounceScale(value)
                }
            </script>
            <script>
            ${config.script}
            </script>
            </html>`
}
