
const path = require('path')
function resolve (dir) {
    return path.join(__dirname, dir)
}
console.log('building with vue app ...')
module.exports = {
    publicPath: './',
    outputDir: resolve("./dist_vue"),
    assetsDir:'assets',
    filenameHashing:false,
    productionSourceMap:false,
    css:{
        extract:false //cs inline
    },
    chainWebpack: config => {
        config.entryPoints.clear()
        config.entry('main').add('./src/renderer/main.ts')
        config.resolve.alias.set('@', resolve('src'))
    }
}
