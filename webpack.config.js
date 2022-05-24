/**
 * webpack 配置文件
 */

const { resolve } = require('path')
//生成产出html文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    //上下文目录
    context:process.cwd(),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'monitor.js'
    },
    devtool:'eval-cheap-module-source-map',
    devServer: {
        //指定加载内容的路径,输出静态资源
        static: resolve(__dirname, 'dist'),
        port: 5500,
        liveReload: true,
        compress:true,
    },
    target:'web',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            //注入monitor.js放到头部，因为要先执行
            inject: 'head',
        }),
        new CleanWebpackPlugin()
    ]
}

