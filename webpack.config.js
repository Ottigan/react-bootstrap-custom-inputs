const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const config = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 4000,
    static: path.resolve(__dirname, 'dist'),
    hot: true,
    open: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      hooks: path.resolve(__dirname, 'src/hooks'),
    },
  },
  plugins: [
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
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
    react: 'react',
    bootstrap: 'bootstrap',
  };
  config.plugins.push(new CleanWebpackPlugin());
}

module.exports = config;
