English | [中文](README-CN.md)

> electron-print-preview : Simulates the print preview module in the browser.

## Install

[![NPM](https://nodei.co/npm/electron-print-preview.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/electron-print-preview/)

## Usage

1. Create electron project
2.  ```npm i electron-print-preview```
3. Use in background.js
```js
const {printPreview}  =  require("electron-print-preview");

printPreview.default.getIntance().createPdfWindow(event, {
    htmlString:`<style>h1{color: #42b983}</style> <h1>hello world !</h1>`
})
```

![](https://whaleluo.oss-cn-beijing.aliyuncs.com/images20230217141521.png)

## Warning

- If webpack is used to pack the main process, modify the following configuration in the webpack configuration of the main process

```json5
{
  externals: {
    'electron-print-preview': 'require("electron-print-preview")'
  }
}
```

- `vue-cli-plugin-electron-builder` config example [vue-cli-plugin-electron-builder-issue](https://github.com/nashaofu/vue-cli-plugin-electron-builder-issue/blob/0f774a90b09e10b02f86fcb6b50645058fe1a4e8/vue.config.js#L1-L8)

```js
// vue.config.js
module.exports = {
  publicPath: '.',
  pluginOptions: {
    electronBuilder: {
      externals: ['electron-print-preview']
    }
  }
}
```