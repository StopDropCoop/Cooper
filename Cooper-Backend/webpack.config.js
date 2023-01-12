const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        bundle: ['./js/index.js', '../Cooper-Website/js/script.js']
    },
    // experiments: {
    //     topLevelAwait: true
    // },
    output: {
        path: path.join(__dirname, '..', 'Cooper-Website', 'js'),
        filename: '[name].js'
    },
    watch: true
}