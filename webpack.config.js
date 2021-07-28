const path = require('path');

module.exports = {
  //entry: './src/apiTest.ts',
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  watch:true,
  watchOptions:{
      ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};