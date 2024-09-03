const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env, argv) => {
   const isDevelopment = argv.mode === 'development';
   return {
      entry: './src/index.js',
      output: {
         path: path.resolve(__dirname, 'build'),
         filename: '[name].js',
         publicPath: '/',
         chunkFilename: '[name].js',
         crossOriginLoading: 'anonymous',
         clean: true,
      },
      mode: isDevelopment ? 'development' : 'production',
      devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
      module: {
         rules: [
            {
               test: /\.jsx?$/,
               exclude: /node_modules/,
               use: {
                  loader: 'babel-loader',
               },
            },
            {
               test: /\.css$/,
               use: ['style-loader', 'css-loader'],
            },
            {
               test: /\.(jpg|jpeg|png|woff|woff2|gif|eot|ttf|svg)$/,
               use: 'url-loader?limit=1024000',
            },
            {
               test: /\.(mp4|mov)$/,
               use: 'url-loader?limit=10000&mimetype=video/mp4',
            },
         ],
      },
      resolve: {
         extensions: ['.webpack.js', '.web.js', '.mjs', '.js', '.jsx', '.json'],
         alias: {
            components: path.resolve(__dirname, 'src/components'),
            asset: path.resolve(__dirname, 'src/assets'),
         },
      },
      plugins: [
         new HtmlWebpackPlugin({
            template: './public/index.html',
         }),

         isDevelopment && new ReactRefreshWebpackPlugin(),
         new BundleAnalyzerPlugin({
            analyzerMode: isDevelopment ? 'disabled' : 'static',
         }),
         !isDevelopment && new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
         }),
      ].filter(Boolean),
      devServer: {
         hot: true,
         open: true,
         port: 3000,
         historyApiFallback: true,
      },

      optimization: {
         splitChunks: {
            cacheGroups: {
               vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
               },
               react: {
                  test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                  name: 'react-vendors',
                  chunks: 'all',
               },
               assets: {
                  test: /\.(jpg|jpeg|png|woff|woff2|gif|eot|ttf|svg)$/,
                  name: 'assets',
                  chunks: 'all',
               },
            },
         },
      },
   };
};
