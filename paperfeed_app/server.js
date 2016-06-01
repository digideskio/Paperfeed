/* eslint-disable no-var, strict */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = 3000;
new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  proxy : {
    "*": "http/localhost:8080"
  },
	stats : {
		colors: true
	}
})
.listen(port, 'localhost', function (err) {
	if (err) {
		console.log(err);
	}
	console.log('Listening at localhost:%s', port);
});
