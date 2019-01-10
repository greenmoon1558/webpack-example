const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const fs = require("fs");
const names = fs
    .readdirSync("./src/")
    .filter(function (file) {
        return file.match(/.*\.(html)$/);
    })
    .map(file => file.split('.')[0]);
  
const modules = names.reduce((arr, currentName) => {
    return [...arr, {
    entry: { main: `./src/${currentName}.js` },
    output: {
      path: path.resolve(__dirname, `dist/${currentName}`),
      filename: "[name].[chunkhash].js"
    },
    target: "node",
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(css|scss)$/,
          use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin("dist", {}),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: `./src/${currentName}.html`,
        filename: `${currentName}.html`
      }),
      new WebpackMd5Hash()
    ]
  }];
}, []);

module.exports = modules;
