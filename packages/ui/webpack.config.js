/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm
const webpack = require('webpack');
// eslint-disable-next-line import/no-unresolved
const { name, version, author, homepage } = require('./package');

module.exports = opt => {
    // 仅build时开启js压缩
    const optimization = opt.build
        ? {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    extractComments: false
                })
            ]
        }
        : {
            minimize: false
        };

    const plugins =  [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'index.css',
        }),
        new ProgressBarPlugin(),
        new webpack.BannerPlugin({
            entryOnly: true, // 是否仅在入口包中输出 banner 信息
            // eslint-disable-next-line no-useless-concat
            banner: () =>
                `${name} v${version}` +
                    '\n' +
                    `Author: ${author}` +
                    '\n' +
                    `Documentation: ${homepage}` +
                    '\n' +
                    `Date: ${new Date()}`
        })
    ];

    // 仅build时开启压缩
    if(opt.build){
        plugins.push(new OptimizeCssAssetsWebpackPlugin());
    }

    return {
        watch: opt.watch,
        mode: 'production',
        stats: {
            assets: true,
            modules: false,
            entrypoints: false
        },
        // 入口文件默认/src/index.ts
        entry: path.resolve(__dirname, './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, './lib'),
            filename: `index.js`,
            library: opt.name,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        devtool: opt.build ? 'none' : 'source-map',
        resolve: {
            extensions: ['.ts', '.js', '.tsx', '.json'],
            // alias: config.alias,
            modules: ['node_modules']
        },
        // 默认排除peerDep依赖,不进行打包
        externals: opt.externals,
        // 允许打包250kb以上的资源
        performance: {
            hints: false
        },
        optimization,
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true, // 关闭类型检查
                                happyPackMode: false
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react'
                            ]
                        }
                    }
                },
                {
                    test: /\.css?$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.less?$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true,
                                },
                            },
                        },
                    ]
                }
            ]
        },
        plugins
    };
};
