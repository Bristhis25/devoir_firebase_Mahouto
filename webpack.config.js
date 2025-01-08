const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv =  require('dotenv-webpack');

module.exports = {
  entry: './public/index.js',
  mode:  'development',
  devServer: {
    static: './public', 
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv(),
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new Dotenv() 
  ],

  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      vm: require.resolve('vm-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },

  
};

