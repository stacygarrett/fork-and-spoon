const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: [ './src/js/index.js' ],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js',
		publicPath: '/'
	},
	devServer: {
		contentBase: './dist' //will serve only what is in dist folder
	},
	plugins: [
		new HtmlWebPackPlugin({
			filename: 'index.html',
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
	/* 	resolve: {
		extensions: [ '.js' ]
	} */
	// mode: 'development'
};
