
/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './src/index',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['', '.js', '.json', '.less', '.jsx']
	},
	devtool: 'cheap-module-source-map',
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('bundle.css', { allChunks: true }),
			 new webpack.DefinePlugin({
					'process.env':{
							'NODE_ENV': JSON.stringify('production')
					}
				}),
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					}
				})
	],
	module: {
		loaders: [
			{
					test: /\.(jsx|js)/,
					loaders: ['react-hot', 'babel'],
					resolve: ['.js', '.jsx'],
					exclude: /node_modules/,
					include: path.join(__dirname, 'src')
			},
			{
					test: /(\.css|.less)$/,
					loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
					resolve:['.less']
			},
			{
					test: /\.(otf|eot|svg|ttf|woff)/,
					loader: 'url-loader'
			}
		]
	}
};
