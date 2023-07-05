const {writeDataToHtml,print_page} = require("./putil");
const css = `
html, body, #app, body, .container, .options {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-app-region: no-drag;
}

button, input, select, a {
    -webkit-app-region: no-drag;
}

body {
    background-color: #53575AFF;
    font-family: Roboto, "Segoe UI", Arial, "Microsoft Yahei", sans-serif;
    font-size: 81.25%;
}

.container {
    width: 100%;
    height: 100%;
    display: flex;
}
iframe{
  margin:0;
  padding:0;
  width:100%;
  display:flex;
  border-sizing:border-box;
}

.container-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
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


.printOptions > div {
    display: flex;
    margin: 15px 0;

}
.printOptions  select,
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

.btn > button:nth-child(2) {
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
.printOptions input[type=number] {
    color: black;
    padding-inline-end: 0;
    width: 34px;
    height: 22px;
}
.printOptions input[type=number][disabled] {
    color: gray;
    padding-inline-end: 0;
    width: 34px;
    height: 22px;
}


.printOptions input[type=number]::-webkit-inner-spin-button,
.printOptions input[type=number]::-webkit-inner-spin-button {
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
.input-margin  span {
    width: fit-content;
    color: white;
    background-color: black;
    font-size: 87%;
}
`

const body = `
<body>
<div id="app">
    <pdf-view></pdf-view>
</div>
</body>
`
const headBefore = `
<head>
    <meta charset="UTF-8">
    <title>打印</title>
`
const headAfter = `
</head>
`

const pdfviewTemplate = `\`
<div class="container">
    <iframe :src="this.pdfUrl" v-if="this.pdfUrl && this.ready"></iframe>
    <div class="container-loading" v-else>
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
          <select
              v-model="selectedPrintDevices"
              class="devices"
              @change="changePrintDevice"
              :disabled="!ready"

          >
            <option
                v-for="(item, index) in printDevices"
                :key="index"
                :value="item.name"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <span>布局</span>
          <select
              v-model="selectedLayout"
              class="devices"
              :disabled="!ready"
          >
            <option value="portrait">纵向</option>
            <option value="landscape">横向</option>
          </select>
        </div>
        <div>
          <span>边距</span>
          <select
              v-model="selectedMargin"
              class="devices"
              :disabled="!ready"
          >
            <option value="10">默认</option>
            <option value="0">无</option>
            <option v-for="opt in 9" :value="opt" :key="opt">{{ opt }}mm</option>
          </select>
        </div>
        <!-- <div>
          <span>彩色</span>
          <select v-model="selectedBackColor"
                  disabled
          >
            <option value="none">黑白色</option>
            <option value="color">彩色</option>
          </select>
        </div> -->
         <div>
          <span>纸张尺寸</span>
          <select
              v-model="selectedPageSize"
              class="devices"
              :disabled="!ready"
          >
            <option v-for="item in pageSize" :value="item" :key="item">{{ item }}</option>
          </select>
        </div>
         <div>
          <span>缩放</span>
          <input v-model="selectedScaleFactor" type="number"
              class="devices"
              oninput="if(value<0)value=0;if(value>100)value=100;vaue=Math.round(value)"
              :disabled="!ready"
            />
        </div>
        <div class="sys-print">
          <button @click.prevent="print(false)" :disabled="!ready">使用系统对话框打印</button>
        </div>
      </div>
      <div class="btn">
        <button class="print" @click="print(false)">打印</button>
        <button class="cancel" @click="cancel">取消</button>
      </div>
    </div>
</div>
\``

const pdfviewComponent = `
const {ipcRenderer} = require("electron") 
    Vue.component('pdf-view', {
        template: ${pdfviewTemplate},
        props: ['todo'],
        data() {
            return {
                printDevices: [],
                selectedPrintDevices: "",
                selectedLayout: "portrait",
                selectedBackColor: "none",
                selectedMargin: "10",
                selectedPageSize:'A4',
                selectedScaleFactor:100,
                pageSize:['A3','A4','A5','Legal','Letter','Tabloid'],
                scaleTimeout:'',
                ready:false,
                pdfUrl:''
            };

        },
        created() {
            ipcRenderer.on('ready',(e,args)=>{
                console.log(e,args)
                this.pdfUrl = args.url
                this.ready = true
            })
            ipcRenderer.invoke("get-printer-list-async").then(data=>{
                console.log("get-printer-list-async", data,arguments);
                this.printDevices = data.printDevices.reverse();
                this.selectedPrintDevices = this.printDevices.find(
                    (item) => item.isDefault === true
                )?.name;
            })
        },
        watch: {
            selectedLayout(newVal, oldVal) {
                this.ready = false
                console.log('the printing direction is changed', newVal, oldVal)
                ipcRenderer.send('reload-pdf',{
                    isLandscape: newVal == "landscape" ? true : false,
                })
            },
            selectedMargin(newVal, oldVal) {
                this.ready = false
                console.log('the printing magrin is changed', newVal, oldVal)
                ipcRenderer.send('reload-pdf', {
                    margin: newVal,
                })
            },
            selectedPageSize(newVal, oldVal) {
                this.ready = false
                console.log('the printing pageSize is changed', newVal, oldVal)
                ipcRenderer.send('reload-pdf', {
                    pageSize:newVal
                })
            },
            selectedScaleFactor(newVal,oldVal){
                this.ready = false
                clearTimeout(this.scaleTimeout)
                this.scaleTimeout = setTimeout(() => {
                    console.log('the printing scaleFactor is changed', newVal, oldVal)
                    ipcRenderer.send('reload-pdf', {
                        scaleFactor:newVal
                    })
                }, 800);

            }
        },
        methods: {
            async print(silent = true) {
                if (!this.selectedPrintDevices) {
                    alert('Please select a printer !')
                    return
                }
                await ipcRenderer.invoke("print", {
                    silent:silent,
                    deviceName: this.selectedPrintDevices,
                });
            },
            cancel() {
                ipcRenderer.invoke("close-pdf-window")
            },
            changePrintDevice() {
            },

        },
    })
    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!'
        }
    });
`


const vueLibRef = `
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>
`

const html = `
<!DOCTYPE html>
<html lang="en">
${headBefore}
<style>
${css}
</style>
${vueLibRef}
${headAfter}
${body}
<script>
${pdfviewComponent}
</script>
</html>
`

writeDataToHtml(print_page,html)

export default function () {

}
