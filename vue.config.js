const path = require('path')
const args = process.argv
//process.env.NODE_ENV development production
function resolve(dir) {
    return path.join(__dirname, dir)
}
const cfIndex = args && args.findIndex(v => v === '--config')
if (cfIndex !== -1 && args[cfIndex + 1]) {
    const configFile = args[cfIndex + 1]
    module.exports = require(`./${configFile}`)
    return
}
module.exports = {
    publicPath: './', outputDir: resolve("./dist"), chainWebpack: config => {
        // 清空默认入口 配置新入口
        // config.entryPoints.clear()
        // config.entry('main').add('./src/renderer/main.ts')
        config.resolve.alias.set('@', resolve('src'))
    }, pluginOptions: {
        electronBuilder: {
            // customFileProtocol: 'pdf://./',  // Make sure to add "./" to the end of the protocol
            // If you want to use the file:// protocol, add win.loadURL(`file://${__dirname}/index.html`) to your main process file
            // In place of win.loadURL('app://./index.html'), and set customFileProtocol to './'
            preload: {preload: 'src/main/preload.ts'}, // option: default // description
            disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
            mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
            // customFileProtocol: 'myCustomProtocol://./',
            // preload: {preload: 'src/main/preload/preload.js', preload_polyfill: 'src/main/preload/preload_polyfill.js'},
            chainWebpackMainProcess: (config) => {
                // Chain webpack config for electron main process only
            }, chainWebpackRendererProcess: (config) => {
                // Chain webpack config for electron renderer process only (won't be applied to web builds)
            }, // Use this to change the entrypoint of your app's main process
            mainProcessFile: 'src/main/background.ts', // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
            rendererProcessFile: 'src/renderer/main.ts'
        }, builderOptions: {
            // protocols: [{ name: 'whale', schemes: ['whale'] }], // mac平台浏览器调起APP协议
        }
    }
}
