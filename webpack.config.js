const path = require("path");
const webpack = require("webpack");

const paths = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
};

module.exports = {
  context: paths.src,
  entry: {
    app: "./index",
  },

  output: {
    path: paths.dist,
    filename: "app.bundle.js",
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
