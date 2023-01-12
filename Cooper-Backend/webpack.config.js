const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    // experiments: {
    //     topLevelAwait: true
    // },
    output: {
        path: path.join(__dirname, '..', 'Cooper-Website'),
        filename: 'bundle.js'
    },
    watch: true
}