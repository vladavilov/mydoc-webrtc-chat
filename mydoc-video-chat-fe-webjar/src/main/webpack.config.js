const packageJSON = require('./package.json');
const path = require('path');
const webpack = require('webpack');

const PATHS = {
    build: path.join(__dirname, '..', '..', 'target', 'classes', 'META-INF', 'resources', 'webjars'/*, packageJSON.name, packageJSON.version*/)
};

module.exports = {
    entry: './js/index.jsx',

    output: {
        path: PATHS.build,
        filename: 'chat-bundle.js'
    },

    module: {
        rules: [{
            test: /\.js(x)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: "[name]_[local]_[hash:base64]",
                    sourceMap: true,
                    minimize: true
                }
            }]
        }]
    }
};