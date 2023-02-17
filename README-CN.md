[English](README.md) | 中文
> electron-print-preview : 模拟浏览器中的打印预览模块。
## 安装

[![NPM](https://nodei.co/npm/electron-print-preview.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/electron-screenshots/)

## 使用

1. 创建一个electron项目 
2. 安装依赖 ```npm i electron-print-preview```
3. 调用打印预览api接口
```js
const {printPreview}  =  require("electron-print-preview");

printPreview.default.getIntance().createPdfWindow(event, {
    htmlString:`<style>h1{color: #42b983}</style> <h1>hello world !</h1>`
})
```

![](https://whaleluo.oss-cn-beijing.aliyuncs.com/images20230217141521.png)

## 注意

- 如果使用了 webpack 打包主进程，请在主进程 webpack 配置中修改如下配置

```json5
{
  externals: {
    'electron-print-preview': 'require("electron-print-preview")'
  }
}
```

- `vue-cli-plugin-electron-builder`配置示例[vue-cli-plugin-electron-builder-issue](https://github.com/nashaofu/vue-cli-plugin-electron-builder-issue/blob/0f774a90b09e10b02f86fcb6b50645058fe1a4e8/vue.config.js#L1-L8)

```js
// vue.config.js
module.exports = {
  publicPath: '.',
  pluginOptions: {
    electronBuilder: {
      // 不打包，使用 require 加载
      externals: ['electron-print-preview']
    }
  }
}
```