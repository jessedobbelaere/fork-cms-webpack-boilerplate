const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map', // Use sourcemaps during development

    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader', // Use inline-css styles
                    'css-loader', // Interprets @import and url() just like import/require statements and resolves them.
                    'sass-loader', // Loads a sass file and compiles it to CSS
                ],
            },
            {
                test: /.*\.(gif|png|jpe?g|svg|gif|ico|cur)$/i,
                loader: 'url-loader',
                query: {
                    limit: 1000, // If file is >1k, it ends in the dist folder instead of being used base64 inline.
                    name: 'img/[name].[ext]',
                },
            },
        ],
    },

    // Configuration for the webpack-dev-server
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // Server will serve from the dist folder
        host: 'localhost', // Make sure we can access the server via any (mobile) device for testing
        port: 3000,
        proxy: {
            '**': 'http://localhost:80', // This is the normal hostname that our website is running on locally.
        },
        historyApiFallback: true,
        inline: true, // Inline mode is recommended for Hot Module Replacement as it includes an HMR trigger from the websocket
        hot: true, // WDS has to run in hot mode to expose hot module replacement interface to the client.
        overlay: true, // Shows a full-screen overlay in the browser when there are compiler errors or warnings
    },
};