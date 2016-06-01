/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
		'./src/index.jsx'
	],
	output: {
		path: __dirname,
		filename: 'bundle.js',
		publicPath: 'http://localhost:3000/static/'
	},
	resolve: {
		extensions: ['', '.js', '.json', '.less', '.jsx']
	},
	devtool: 'eval',
	plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
			 new webpack.DefinePlugin({
				'process.env':{
						'NODE_ENV': JSON.stringify('development')
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
