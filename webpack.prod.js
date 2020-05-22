const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const Terserplugin = require('terser-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    output: {
        libraryTarget: 'var',
        library: 'Client'

    },
    optimization: {
        minimizer: [new Terserplugin({}), new OptimizeCssAssetsPlugin({})],
    },
    module: {
        rules: [{
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },

            {
                //remember that sass can't have quotes!
                test: /\.scss$/,
                //style-loader is loaded as inline styles, which is slow. Replace it with MiniCssExtractPlugin loader.
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/i,
                use: [{
                    loader: 'file-loader',
                }, ]

            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        // new WorkboxPlugin.GenerateSW()
    ]
}