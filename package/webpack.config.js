module.exports = {
    entry: {
        PdfWindow: {
            import: '../src/main/PdfWindow.ts',
            filename: '[name].js',
            library: {
                name: 'PdfWindow',
                type: 'commonjs',
            },
        },
        preload: { import: '../src/main/preload.ts', filename: '[name].js' },
    },
    target: 'electron-main',
    module: {
        // Use `ts-loader` on any file that ends in '.ts'
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    // Bundle '.ts' files as well as '.js' files.
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: `${process.cwd()}/dist`,
    }
};