const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 3000,
    static: path.resolve(__dirname, 'dist'),
    hot: true,
    open: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(dist|node_modules|bower_components)/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

if (currentTask === 'dev') {
  config.plugins.push(new HtmlWebpackPlugin({ template: './src/index.html' }));
  config.devtool = 'inline-source-map';
} else if (currentTask === 'build') {
  config.mode = 'production';
  config.entry = './src/main.jsx';
  config.output.filename = 'index.js';
  config.output.library = 'react-bootstrap-custom-inputs';
  config.output.libraryTarget = 'umd';
  config.externals = {
    'prop-types': 'prop-types',
    bootstrap: 'bootstrap',
    moment: 'moment',
    i18next: 'i18next',
    'react-i18next': 'react-i18next',
  };
  config.plugins.push(new CleanWebpackPlugin());
}

module.exports = config;
