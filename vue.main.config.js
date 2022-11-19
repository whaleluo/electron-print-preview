const path = require('path')
// const RemovePlugin = require('remove-files-webpack-plugin');
console.log('building with outer renderer ...')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'))
        // 删除 HTML 相关的 webpack 插件
        config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
       /*     [
                [
                    {
                        from: 'D:\\user\\vue3-electron-webpack-ts\\public',
                        to: 'D:\\user\\vue3-electron-webpack-ts\\dist_electron\\bundled',
                        toType: 'dir',
                        ignore: [Array]
                    }
                ]
            ]
        */
        config
            .plugin('copy')
            .tap(args => {
                args[0].push(
                    {
                        from: resolve('dist_vue'),
                        to: args[0][0].to,
                        toType: 'dir',
                    }
                )
                return args
            })
        console.log(1234444)

    }, pluginOptions: {
        electronBuilder: {
            preload: {preload: 'src/main/preload.ts'}, // option: default // description
            customFileProtocol: './',
            disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
            mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
            chainWebpackMainProcess: (config) => {
                // Chain webpack config for electron main process only
            },
            chainWebpackRendererProcess: (config) => {
                // Chain webpack config for electron renderer process only (won't be applied to web builds)
            },
            mainProcessFile: 'src/main/background.ts',
            rendererProcessFile: 'src/renderer/main.ts'
        }
    }
}
