const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    // experiments: {
    //     topLevelAwait: true
    // },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true
}