# electron-print-preview

>A print preview module that simulates Chrome browser

## How to use electron-print-preview in project

1. create a electron project
2. ```npm i electron-print-preview```
3. a example like ./examples project

```js
const {printPreview}  =  require("electron-print-preview");

printPreview.default.getIntance().createPdfWindow(event, {
    htmlString:`<style>h1{color: #42b983}</style> <h1>hello world !</h1>`
})

```
![](https://whaleluo.oss-cn-beijing.aliyuncs.com/imagesexample1.png)
 