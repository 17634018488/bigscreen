const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern-compiler'
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10000
            }
          },
          generator: {
            filename: '[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: '[name].[hash][ext]'
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'style.[contenthash].css' : 'style.css'
      }),
      new CleanWebpackPlugin(),
      new Dotenv({
        path: isProduction ? './.env.production' : './.env.development',
        systemvars: true
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      hot: true,
      port: 8090,
      open: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          pathRewrite: { '^/api': '' }
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    mode: isProduction ? 'production' : 'development'
  }
}