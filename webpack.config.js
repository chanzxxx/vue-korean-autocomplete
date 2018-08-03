const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'vue-korean-autocomplete': './src/index.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
    library: 'VueKoreanAutocomplete',
    libraryTarget: 'umd'

  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        enforce: 'pre',
        include: [path.join(__dirname, './src'), path.join(__dirname, './test')],
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        include: [path.join(__dirname, './src'), path.join(__dirname, './test')],
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [require('autoprefixer')]
        }
      }
    ]
  }
};

// bundle html files
module.exports.plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './demo/index.html',
    inject: false
  })
];

module.exports.devtool = '#cheap-module-eval-source-map';

