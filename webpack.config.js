const path = require('path');
const nodeExternals = require('webpack-node-externals');

const prod = 'production';
const dev = 'development';
const mode = process.env.NODE_ENV === prod ? prod : dev;

module.exports = {
  mode: mode,
  entry: './src/index.ts',
  devtool: 'source-map',
  target: 'node',
  watch: mode === dev,

  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/dist')
  },
};
