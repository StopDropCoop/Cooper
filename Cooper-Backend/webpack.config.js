const path = require('path')

module.exports = {
    mode: 'development',
    entry: './js/index.js',
    // experiments: {
    //     topLevelAwait: true
    // },
    output: {
        path: path.join(__dirname, '..', 'Cooper-Website', 'js'),
        filename: 'bundle.js'
    },
    watch: true
}