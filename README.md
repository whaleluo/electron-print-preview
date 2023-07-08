> electron-print-preview : 模拟浏览器中的打印预览模块。(参考浏览器为electron项目提供打印预览功能)

## 注意
1. electron不同版本之间打印相关api变化比较大
2. 当前组件依赖于electron@24.1.2
## 安装

[![NPM](https://nodei.co/npm/electron-print-preview.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/electron-print-preview/)

## 使用

1. 创建一个electron项目 
2. 安装依赖 ```yarn add electron-print-preview```
3. 调用打印预览api接口
```js
const {startPrint} = require("electron-print-preview");
const {app} = require("electron");
app.whenReady().then(()=>{
    startPrint({htmlString :`<style>h1{color: #42b983}</style> <h1>hello world !</h1>`},undefined)
})

```

![](https://whaleluo.oss-cn-beijing.aliyuncs.com/imageselectron_pdf.gif)