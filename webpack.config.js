const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }
    return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
console.log('is Dev:', isDev);

const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: (resourcePath, context) => 
                {
                    return path.relative(path.dirname(resourcePath), context) + '/';
                
                },
            },
        },
            'css-loader'
    ]
    if(extra) {
        loaders.push(extra);
    }
    return loaders;
}

const babelOptions = preset => {
    const opts = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
    }

    if(preset) {
        opts.presets.push(preset);
    }
    return opts
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
        // analytics: './analytics.ts',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src/js'),
            '@': path.resolve(__dirname, 'src'),
        },
    },
    devServer: {
        port: 4200,
        open: true,
        hot: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
    ],
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options:babelOptions(),
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: babelOptions('@babel/preset-typescript'),
                }
            },
            // {
            //     test: /\.jsx$/,
            //     exclude: /node_modules/,
            //     use: {
            //       loader: 'babel-loader',
            //       options: babelOptions('@babel/preset-react'),
            //     }
            // },
            {
                test: /\.css$/,
                use: cssLoaders(),
                
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader'),
            },
            {
                test: /\.s[a|c]ss$/,
                use: cssLoaders('sass-loader'),
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader'],
            },
            {
                test: /\.xml$/,
                use: ['xml-loader'],
            },
            {
                test: /\.csv$/,
                use: ['csv-loader'],
            }
        ]
    }
}