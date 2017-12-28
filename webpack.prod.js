const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    devtool: "eval", // No sourcemaps in production

    output: {
        filename: "[name].[chunkhash].js" // Use hashed filenames based on changes, for long-term browser caching!
    },

    module: {
        loaders: [
            {
                test: /.*\.(css|scss)$/,
                exclude: /(node_modules|vendor|bower_components)/,
                use: ExtractTextPlugin.extract({
                    use: [
                        "css-loader?sourceMap=false", // Interprets @import and url() just like import/require statements and resolves them.
                        "postcss-loader?sourceMap=false", // Apply PostCSS pllugins defined in postcss.config.js
                        "resolve-url-loader?sourceMap=false", // Avoid url paths in imported Sass files to be messed up
                        "sass-loader?sourceMap=false" // Loads a sass file and compiles it to CSS
                    ],
                    fallback: "style-loader"
                })
            },
        ]
    },

    plugins: [
        // Minify JS code in production.
        // UglifyJS will automatically drop any unreachable code too.
        new UglifyJSPlugin({
            parallel: true,
            sourceMap: false, // Let's not keep sourcemaps in production
        }),

        // Enable concatenation of the scope of modules into one closure for faster execution time (similar to Rollup 'hoisting').
        // It enables the ability to concatenate the scope of all your modules into one closure and allow for your
        // code to have a faster execution time in the browser.
        new webpack.optimize.ModuleConcatenationPlugin(),

        // Merge similar chunks of code
        new webpack.optimize.AggressiveMergingPlugin(),

        // Save CSS to a single file to use in production.
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css", // Let the hash be based on the content of the extracted file (caching!).
            allChunks: true
        }),

        // Extract common code to a vendor file
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.[chunkhash].js",
            minChunks(module, count) {
                return module.context && module.context.indexOf("node_modules") >= 0;
            }
        }),
    ]
}

module.exports = config;
