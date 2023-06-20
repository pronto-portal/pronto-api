const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');


module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.build'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts', '.js', '.cjs'],
  },
  module: {
    rules: [
        {
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: [/node_modules/, /\.d\.ts$/],
            options: {
              transpileOnly: true,
            },
          },
        {
            test: /\.(?:js|mjs|cjs)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
        }      
    ],
  },
};
