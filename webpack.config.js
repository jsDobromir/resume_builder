// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = true;

const config = {
  entry: {
    editor: ['./src/editor.js', './src/sass/editor.scss'],
    resumes : './src/resumes.js'
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: "./src/editor.html",
    //   filename: "editor.html",
    //   chunks: ["editor"],
    //   favicon: "./src/public/favicon.ico"
    // }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].css"
    })

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {loader: 'css-loader', options: { url: false }}, {loader: 'postcss-loader', options: {postcssOptions: {plugins: () => [require('autoprefixer')]}}}, {loader: 'sass-loader'}],
        
      },
      // {
      //   test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
      //   type: "asset",
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
