const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SizePlugin = require('size-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const publicPath = `/src/Frontend/Themes/${path.basename(__dirname)}/dist/`;

module.exports = env => {
    const commonConfig = {
        entry: {
            app: path.resolve(__dirname, './Core/Js/app.js'),
        },
        output: {
            path: buildPath,
            publicPath: publicPath,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    loader: 'url-loader',
                    query: {
                        name: 'fonts/[name].[ext]',
                    },
                },
            ],
        },
        plugins: [
            // Clean the dist folder before running webpack.
            new CleanWebpackPlugin(),

            // Show the progress while building.
            env.noProgress ? null : new webpack.ProgressPlugin(),

            // Print the gzipped sizes of your webpack assets and changes since the last build.
            new SizePlugin(),

            // Automatically load modules instead of having to import/require them everywhere.
            // This way we can use jQuery plugins easily in our code.
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                'window.jQuery': 'jquery',
                _: 'lodash',
            }),

            // Generate an asset manifest file, so we can leverage Symfony 3.3's Manifest-based asset versioning
            // See https://symfony.com/blog/new-in-symfony-3-3-manifest-based-asset-versioning
            new ManifestPlugin({
                publicPath,
                writeToFileEmit: true, // Make sure manifest is created on webpack-dev-server too!
            }),
        ].filter(Boolean),
    };

    // Merge our common configuration with the environment-specific (dev/prod) config.
    const envConfig = require(`./webpack.${env.mode}`);
    return webpackMerge({ mode: env.mode }, commonConfig, envConfig);
};
