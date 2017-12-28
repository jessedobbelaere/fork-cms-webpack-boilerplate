const webpack = require('webpack');
const path = require('path');
const webpackMerge = require("webpack-merge");
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'production';
const BUILD_PATH = path.resolve(__dirname, "dist");
const PUBLIC_BUILD_PATH = "/src/Frontend/Themes/MyTheme/dist/";

module.exports = () => {
    const commonConfig = {
        entry: {
            app: path.resolve(__dirname, "./Core/Js/app.js")
        },

        output: {
            path: BUILD_PATH,
            publicPath: PUBLIC_BUILD_PATH
        },

        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|vendor|bower_components)/,
                    loader: "babel-loader"
                },
                {
                    test: /.*\.(gif|png|jpe?g|svg|gif|ico|cur)$/i,
                    loader: "url-loader",
                    query: {
                        limit: 10000, // If file is >10k, it ends in the dist folder instead of being used base64 inline.
                        name: "img/[name].[ext]"
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    loader: "url-loader",
                    query: {
                        name: "fonts/[name].[ext]"
                    }
                }
            ],
        },

        plugins: [
            // Remove the dist folder before running webpack.
            new CleanWebpackPlugin([BUILD_PATH]),

            // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV` inside your code for any
            // environment checks. UglifyJS will automatically drop any unreachable code in production mode.
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(nodeEnv)
                }
            }),

            // Automatically load modules instead of having to import/require them everywhere.
            // This way we can use jQuery plugins easily in our code.
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery",
                "window.jQuery": "jquery",
                '_': 'lodash'
            }),

            // Show the progress while building.
            new webpack.ProgressPlugin(),

            // Speed up building (See https://medium.com/ottofellercom/0-100-in-two-seconds-speed-up-webpack-465de691ed4a)
            new HardSourceWebpackPlugin(),

            // Generate an asset manifest file, so we can leverage Symfony 3.3's Manifest-based asset versioning
            // See https://symfony.com/blog/new-in-symfony-3-3-manifest-based-asset-versioning
            new ManifestPlugin({
                publicPath: PUBLIC_BUILD_PATH,
                writeToFileEmit: true // Make sure manifest is created on webpack-dev-server too!
            }),
        ]
    };

    // Merge our common configuration with the environment-specific (dev/prod) config.
    const shortNodeEnv = nodeEnv === "development" ? "dev" : "prod";
    const envConfig = require(`./webpack.${shortNodeEnv}.js`);
    return webpackMerge(commonConfig, envConfig);
}
