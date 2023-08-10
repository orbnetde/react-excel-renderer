const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        library: {
            type: 'commonjs-module'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: 10,
                minify: TerserPlugin.uglifyJsMinify,
                terserOptions: {
                    compress: true
                },
            })
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        }
    }
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new TerserPlugin({
    //             extractComments: false,
    //             terserOptions: {
    //                 format: {
    //                     comments: false,
    //                 },
    //             },
    //         }),
    //     ],
    //
    // }
};
