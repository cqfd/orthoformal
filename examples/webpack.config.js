// @flow

const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'index.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', { modules: false }], 'stage-2', 'react']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // postcss and sass
              modules: true // css modules by default
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: autoprefixer,
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin,
    new webpack.NamedModulesPlugin
  ],
}
