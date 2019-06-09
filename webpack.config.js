const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        'sdk.uglify.js': './public/js/sdk.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js'
    },
    optimization: {
        minimize: true
    }
}
