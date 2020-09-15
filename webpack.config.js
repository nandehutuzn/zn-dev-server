const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const resolve = file => path.resolve(__dirname, file)

module.exports = {
  mode: 'development',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      // 路径别名，@指向 src
      '@': resolve('../src/')
    },
    extensions: ['.js', '.vue', '.json']
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.js$/,
        // node_modules 文件夹内的js文件不用编译，不然运行时会报错
        exclude: [/node_modules/, /dist/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // {
      //   test: /\.(js|vue)$/,
      //   include: path.join(__dirname, 'src'),
      //   use: {
      //     loader: 'eslint-loader',
      //     options: {
      //       formatter: require('eslint-friendly-formatter'),
      //       fix: true
      //     }
      //   },
      //   enforce: 'pre'
      // },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, // 10kb 直接打包进bundle，不然内部使用file-loader打包
            // 如果项目中使用了vue-loader，则下面配置是必须的
            // 因为vue-loader会将src值解析为require()，而url-loader默认是通过import方式导入资源的
            esModule: false
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: '"/"',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      title: 'dev',
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'public'),
          to: ''
        }
      ]
    }),
  ]
}