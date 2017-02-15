// @flow

const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'orthoformal'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'index.js'), path.resolve(__dirname, 'status.js')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [["es2015", { modules: false }], "stage-2", "react"]
          }
        }
      }
    ]
  }
}
