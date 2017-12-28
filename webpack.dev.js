const webpack = require('webpack');
const path = require('path');

const config = {
    devtool: "cheap-module-eval-source-map", // Use sourcemaps during development

    output: {
        filename: "[name].js"
    },

    module: {
        loaders: [
            {
                // During development, our css styles will be loaded inline in the app.js file for HMR purposes.
                test: /.*\.(css|scss)$/,
                exclude: /(node_modules|vendor|bower_components)/,
                use: [
                    "style-loader?sourceMap", // Use inline-css styles
                    "css-loader?sourceMap", // Interprets @import and url() just like import/require statements and resolves them.
                    "postcss-loader?sourceMap", // Apply PostCSS plugins defined in postcss.config.js
                    "resolve-url-loader?sourceMap", // Avoid url paths in imported Sass files to be messed up
                    "sass-loader?sourceMap&sourceComments" // Loads a sass file and compiles it to CSS
                ],
            },
        ]
    },

    // Configuration for the webpack-dev-server
    devServer: {
        contentBase: path.resolve(__dirname, "dist"), // Server will serve from the dist folder
        host: "0.0.0.0", // Make sure we can access the server via any (mobile) device for testing
        port: 3000,
        proxy: {
            "**": "http://localhost:80" // This is the normal hostname that our website is running on locally.
        },
        historyApiFallback: true,
        inline: true, // Inline mode is recommended for Hot Module Replacement as it includes an HMR trigger from the websocket
        hot: true, // WDS has to run in hot mode to expose hot module replacement interface to the client.
        overlay: true // Shows a full-screen overlay in the browser when there are compiler errors or warnings
    },

    plugins: [
        // To enable Hot Module Replacement (HMR):
        // 1. WDS has to run in hot mode to expose the hot module replacement interface to the client
        // 2. Webpack has to provide hot updates to the server. This is achieved with the HotModuleReplacementPlugin.
        // 3. The client has to run specific scripts provided by the WDS. They are injected automatically.
        // 4. The client has to implement the HMR interface through module.hot.accept (see app.js).

        // Enable the plugin to let webpack communicate changes to WDS
        new webpack.HotModuleReplacementPlugin(),

        // When HMR is enabled, the relative path of the module is displayed during development.
        // This plugin replaces webpack's module IDs with paths to the modules making it ideal for development.
        new webpack.NamedModulesPlugin(),
    ]
}

module.exports = config;
