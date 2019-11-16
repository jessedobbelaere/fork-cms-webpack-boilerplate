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
            app: path.resolve(__dirname, './Core/Js/app.ts'),
        },
        output: {
            path: buildPath,
            publicPath: publicPath,
        },
        // Webpack does not look for .ts files by default. Configure it to look for Typescript files too.
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loaders: ['babel-loader'],
                },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'
                {
                    test: /\.js$/,
                    use: ['source-map-loader'],
                    enforce: 'pre',
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
