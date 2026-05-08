const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

const ROOT = path.resolve(__dirname, '.')
const srcPath = `${ROOT}/client`
const outputPath = `${ROOT}/client/dist`

const modeArgIndex = process.argv.indexOf('--mode')
const modeArg = modeArgIndex === -1 ? undefined : process.argv[modeArgIndex + 1]
const production = (process.env.NODE_ENV || modeArg) === 'production'
const clientEnv = {
  'process.env.ORIGIN': JSON.stringify(process.env.ORIGIN || ''),
}

const config = {
  devtool: production ? undefined : 'sourcemap',
  mode: process.env.NODE_ENV || 'development',
  stats: {
    assets: true,
    warnings: true,
    children: false,
    depth: false,
    entrypoints: false,
    errors: true,
    errorDetails: true,
    hash: false,
  },
  entry: [`${srcPath}/index.js`],
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  context: srcPath,
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      components: `${srcPath}/components`,
      assets: `${srcPath}/assets`,
      lib: `${srcPath}/lib`,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|otf|webp)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hypersight',
      inject: true,
      template: `${srcPath}/index.ejs`,
      favicon: `${srcPath}/assets/favicon.ico`,
      devLiveReload: !production,
      minify: {
        removeComments: production,
        collapseWhitespace: production,
        removeRedundantAttributes: production,
        useShortDoctype: production,
        removeEmptyAttributes: production,
        removeStyleLinkTypeAttributes: production,
        keepClosingSlash: production,
        minifyJS: production,
        minifyCSS: production,
        minifyURLs: production,
      },
      meta: {
        description: 'Hypersight real-time public-data visualizer for Hyperliquid trades',
      },
      cache: false,
    }),
    new MiniCssExtractPlugin({
      filename: production ? '[name].[hash].css' : '[name].css',
      chunkFilename: production ? '[id].[hash].css' :'[id].css',
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin(clientEnv),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new BundleAnalyzerPlugin(),
  ],
}

if (production) {
  config.plugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.7,
    })
  )
}

module.exports = config
